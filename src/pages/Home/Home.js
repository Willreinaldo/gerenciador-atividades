
import React, { useState, useEffect } from 'react';
import '../../assets/PageResponsive.css'
import { Navigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/index'
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
import '@fontsource/roboto/300.css';
import { Button, Typography, Grid, Divider, Container, Card, TextField, Link } from '@mui/material';
const cardStyle = { width: '60vw', minWidth: '60vw', minHeight: '40vh' }
const topStyle = { marginLeft: '2em', display: "flex", gap: "6px", marginTop: '11px' }
const bottomStyle = { display: "flex", justifyContent: 'center', gap: "6px", marginTop: '11px' }
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
            <Container align='center' sx={{ marginTop: '10em' }}>
                <Typography component={'div'}> Aguarde...</Typography>
                <CircularProgress size={70}></CircularProgress>
            </Container>
        )
    }

    if (displayTasks.length === 0) {
        return (
            <>
                <Navbar />
                <Container sx={{ marginTop: '10em' }} align='center'>
                    <Typography component={'div'} variant='h4'> Nenhuma solicitação no momento...</Typography>
                </Container>
            </>
        )
    }
    if (!user) {
        return (<Navigate to="/login" />
        )
    }

    return (
        <>
            <Navbar />
            <Grid mt={14} align="center">
                <Typography variant="h4" component={'div'} align="center">Solicitações</Typography>
                <TextField label="Filtrar por título ou Status"
                    value={searchTask}
                    variant="standard"
                    onChange={(e) => setSearchTask(e.target.value)} />
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
                    <Card elevation={10} key={index} style={cardStyle} sx={{ my: 4 }}>
                        <Container align="left" style={topStyle} className="containerCardTop">
                            <Typography component={'div'} color="#A9A9A9">#{task.id.slice(1, 6)}</Typography>
                            <Typography component={'div'} color="primary"> {task.user} </Typography>
                            <Typography component={'div'} fontStyle="italic">{task.date}:</Typography>
                        </Container>
                        <Button style={{ cursor: 'default' }}>{task.status}</Button>
                        <Typography component={'div'} variant="h4">{task.title} </Typography>
                        <Typography component={'div'} sx={{ mx: 2 }}>{ReactHtmlParser(task.description)}</Typography>
                        <Divider orientation="vertical" flexItem />
                        <Button onClick={() => handleEdit(task)}><EditOutlinedIcon /></Button>
                        <Button onClick={() => handleDelete(task.id, task.fileUrl)}><DeleteForeverIcon /></Button>
                        <Container style={bottomStyle} className="containerCard">
                            <Typography component={'div'}><strong>Produto: </strong> {task.product} </Typography>
                            <Typography component={'div'}> <strong>Categoria: </strong> {task.category}</Typography>
                            <Typography component={'div'}> <strong>Prioridade</strong>:{task.priority} </Typography>
                        </Container>
                        <Divider orientation="vertical" flexItem />
                        <Button> <Link href={task.fileUrl} target="_blank" rel="noreferrer" sx={{ p: 3 }}>Abrir arquivo</Link></Button>
                    </Card>)}
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
                {showModal && editTask ? (<Modal onClose={() => setShowModal(false)} editTask={editTask}></Modal>) : null}
            </Grid>
        </>
    )
}
export default Home;
