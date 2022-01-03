import React, { useState } from 'react';
import './Modal.css';
import {
    uploadBytesResumable,
    ref,
    getDownloadURL,
} from 'firebase/storage';
import { storage, db } from '../../utils/firebase'
import { doc, updateDoc } from "@firebase/firestore";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const Modal = ({ onClose = () => { }, editTask }) => {
    var navigate = useNavigate();
    var taskschanged = editTask;
    const [submitbutton, setSubmitbutton] = useState(false);
    const [priority, setPriority] = useState(editTask.priority);
    const [title, setTitle] = useState(editTask.title)
    const [product, setProduct] = useState(editTask.product);
    const [status, setStatus] = useState(editTask.status);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState(editTask.description);
    const [category, setCategory] = useState(editTask.category);
    let events = ""


    var data = new Date(); var dia = data.getDate(); var mes = data.getMonth(); var ano = data.getFullYear();
    var segundos = data.getSeconds(); var minutos = data.getMinutes(); var horas = data.getHours();
    const dataAtual = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;


    async function handleRegister(e) {
        e.preventDefault();

        if (taskschanged.status !== status) {

            events += `\\   Modificou o status de: "${taskschanged.status}" para: "${status}" em  ${dataAtual}.           `;
        }
        else if (taskschanged.title !== title) {

            events += `\\   Modificação no título de: "${taskschanged.title}" para: "${title}" em  ${dataAtual}.             `;
        }
        else if (taskschanged.description !== description) {

            events += `\\   Modificação na descrição de: "${taskschanged.description}" para: "${description}" em  ${dataAtual}.     `;
        }
        if (taskschanged.product !== product) {

            events += `\\   Modificação no produto  de: "${taskschanged.product}" para: "${product}" em  ${dataAtual}. `;
        }
        if (taskschanged.category !== category) {

            events += `\\   Modificação na categoria de "${taskschanged.category}" para: "${category}"  em ${dataAtual}. `;
        }
        if (taskschanged.priority !== priority) {

            events += `    Modificação na prioridade de: "${taskschanged.priority}" para: "${priority}""  em ${dataAtual}".`;
        }
        //Ref da db
        const docRef = doc(db, 'tasks_db', editTask.id)
        //atualiza arquivo
        if (!file) return;
        const sotrageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(sotrageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                console.log("upload is " + prog + " done");
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    ((downloadURL) => {
                        updateDoc(docRef, {
                            product,
                            status,
                            title,
                            description,
                            category,
                            priority,
                            events,
                            fileUrl: downloadURL
                        })
                    })).then(navigate(-1))
            }
        )};


    return (

        <div className="modal">
            <div className="container">
                <button className="close" onClick={onClose}>  <CloseIcon></CloseIcon></button>
                <div className="content">
                    <form action="#" onSubmit={handleRegister}>
                        <div className="input-box">
                            <h2>Atualize a tarefa</h2>
                            <label>Titulo: </label>
                            <input
                                type="text"
                                placheholder="Título"
                                value={title}
                                onChange={(e) => setTitle(e.currentTarget.value)}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <label>Produto: </label>
                            <input
                                type="text"
                                placeholder="Produto"
                                value={product}
                                onChange={(e) => setProduct(e.currentTarget.value)}
                                required />
                        </div>
                        <div className="input-box">
                            <label>Descrição: </label>
                            <textarea rows="5"
                                cols="65"
                                type="text"
                                placeholder="Descrição"
                                value={description}
                                onChange={(e) => setDescription(e.currentTarget.value)}
                                required />
                        </div>
                        <div className="input-box">
                            <label>Categoria: </label>
                            <input
                                type="text"
                                placeholder="Categoria"
                                value={category}
                                onChange={(e) => setCategory(e.currentTarget.value)}
                                required />
                        </div>
                        <div>
                            <label>Status:</label>
                            <select
                                onChange={(e) =>
                                    setStatus(e.target.options[e.target.selectedIndex].text)
                                }
                                required>
                                <option value="pending">Pendente</option>
                                <option value="progress">Em andamento</option>
                                <option value="complete">Finalizada</option>
                                <option value="canceled">Cancelada</option>
                            </select>
                        </div>
                        <div>
                            <label>Prioridade:</label>
                            <select
                                onChange={(e) =>
                                    setPriority(e.target.options[e.target.selectedIndex].text)
                                }
                                required>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                                <option value="low">Baixa</option>
                            </select>
                        </div>
                        <div className="input-box">
                            <label className="file">Arquivo: </label>
                            <input
                                id="docfile"
                                type="file"
                                accept="pdf/txt"
                                onChange={(e) =>
                                    setFile(e.currentTarget.files[0])
                                }
                                className="button" />
                        </div>
                        <div></div>
                        <div className="input-box button">
                            <br />
                            <input
                                type="Submit"
                                placeholder="Enviar" disabled={submitbutton === true} />
                        </div>
                    </form>
                    <div className="historic">
                        Historico de alterações de  <strong>{editTask.user} </strong>:
                        <div className="historicBody">
                            <p> {editTask.events}</p>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Modal;