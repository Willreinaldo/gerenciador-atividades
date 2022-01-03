import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/index'
import { Grid } from '@mui/material'
import './Home.css'
import { db, q, storage } from '../../utils/firebase';
import { deleteObject } from "@firebase/storage";
import { getDocs, deleteDoc, doc } from "@firebase/firestore";
import { useUserAuth } from '../../context/UserAuthContext';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '../../Components/Modal';
import ReactHtmlParser from 'react-html-parser';
import ReactPaginate from 'react-paginate';

function Home() {
    const { user } = useUserAuth();
    const [TasksData, setTasksData] = useState([]);
    const [editTask, setEditTask] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTask, setSearchTask] = useState('');
    const [pageNumber, setpageNumber] = useState(0);
    //editar a tarefa
    const handleEdit = (data) => {
        window.scrollTo({ top: 5, behavior: 'smooth' });
        setShowModal(true);
        setEditTask(data);
    }
    //deleta a tarefa e exclui o arquivo da tarefa
    const handleDelete = (id, fileUrl) => {
        let decision = window.confirm("Você quer mesmo deletar essa tarefa?");
        if (decision) {

            const taskDoc = doc(db, "tasks_db", id);
            const storageRef = storage().refFromUrl(storage, fileUrl);
            deleteObject(storageRef);
            deleteDoc(taskDoc)
            const filteredtasks = [...TasksData];
            let task = filteredtasks.filter(task => task.id !== id);
            setTasksData(task);
        }
    }

    //paginação
    const tasksItems = TasksData.slice(0, 50)
    const tasksPerPage = 30;
    const pagesVisited = pageNumber * tasksPerPage;
    const displayTasks = tasksItems.slice(pagesVisited, pagesVisited + tasksPerPage)
    const pageCount = Math.ceil(tasksItems.length / tasksPerPage)

    const pageChange = ({ selected }) => {
        setpageNumber(selected)
    }


    //pega os dados do db
    useEffect(() => {
        async function tasklist() {
            setLoading(false);
            await getDocs(q)
                .then(snapshot => {
                    let taskslist = []
                    snapshot.docs.forEach(doc => {
                        taskslist.push({ ...doc.data(), id: doc.id })
                    })
                    setTasksData(taskslist.filter((task) => task.user === user.email))
                    setLoading(true);
                })
                .catch(err => {
                    console.log(err.message)
                })
        } tasklist();
        return () => tasklist();

    }, [])

    if (loading === false) {
        return (
            <h3 className="loading"> Aguarde... <CircularProgress size={70}></CircularProgress></h3>
        )
    }

    if (displayTasks.length === 0) {
        return (
            <>
                <Navbar />
                <div className="wrapper">
                    <h3> Nenhuma solicitação no momento...</h3>
                </div>
            </>
        )
    }
    if (!user) {
        return (
            <Navigate to="/login" />
        )

    }
    return (
        <>
            <Navbar />
            <Grid>
                <div>
                    <div className="wrapper">
                        <h2>Solicitações</h2>
                        <h4 className="filter-title">Filtrar por título ou status: </h4>
                        <div className="filter">
                            <input className="search" type="text" value={searchTask} placeholder="Filtrar por título ou status" onChange={(e) => setSearchTask(e.target.value)} />
                        </div>
                        <ReactPaginate
                            previousLabel={"Anterior"}
                            nextLabel={"Próxima"}
                            pageCount={pageCount}
                            onPageChange={pageChange}
                            containerClassName={"paginationsBttns"}
                            previousLinkClassName={"previousBttn"}
                            nextLinkClassName={"nextBttn"}
                            disabledClassName={"paginationDisabled"}
                            activeClassName={"pagination"}
                        />
                        {displayTasks.filter((task) => {
                            // filtrando os registros pelo status e pelo titulo
                            if (searchTask === '') {
                                return task
                            }
                            else if (task.title?.toLowerCase().includes(searchTask.toLowerCase())) {
                                return task
                            }
                            else if (task.status?.toLowerCase().includes(searchTask.toLowerCase())) {
                                console.log(searchTask);
                                return task
                            }

                        }).map((task, index) =>
                            <div className="card" key={index}>
                                <div style={{ color: "grey" }} className="headerCard">#{task.id.slice(1, 6)} |  <strong> {task.user} </strong> : </div>
                                <div className="headerCard">  <h4>{task.title} </h4>| {task.status}
                                    <span style={{ color: "grey", fontStyle: 'italic' }}> | {task.date}</span>
                                    <div>  <button onClick={() => handleEdit(task)}><EditOutlinedIcon className="button" /></button></div>
                                    <div>  <button onClick={() => handleDelete(task.id, task.fileUrl)}><DeleteForeverIcon className="button" /></button></div>
                                </div>
                                <div className="bodyCard" > {ReactHtmlParser(task.description)}</div>
                                <div className="footerCard" ><strong>Produto: </strong> {task.product} | <strong>Categoria: </strong>  {task.category} |
                                    <strong>Prioridade</strong>:{task.priority} | <a href={task.fileUrl} target="_blank"  rel="noreferrer">Abrir arquivo</a> </div>
                            </div>)}
                        <ReactPaginate
                            previousLabel={"Anterior"}
                            nextLabel={"Próxima"}
                            pageCount={pageCount}
                            onPageChange={pageChange}
                            containerClassName={"paginationsBttns"}
                            previousLinkClassName={"previousBttn"}
                            nextLinkClassName={"nextBttn"}
                            disabledClassName={"paginationDisabled"}
                            activeClassName={"pagination"}
                        />

                    </div>
                    {showModal && editTask ? (<Modal onClose={() => setShowModal(false)} editTask={editTask}></Modal>) : null}
                </div>
            </Grid>

        </>
    )
}
export default Home;
