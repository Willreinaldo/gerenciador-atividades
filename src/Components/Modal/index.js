import React, { useState } from 'react';
import '../../assets/PageResponsive.css'
import {
    uploadBytesResumable,
    ref,
    getDownloadURL,
} from 'firebase/storage';
import { storage, db } from '../../utils/firebase'
import { doc, updateDoc } from "@firebase/firestore";
import CloseIcon from '@mui/icons-material/Close';
import ReactHtmlParser from 'react-html-parser';
import {
    Button, Typography, Grid, Card, Divider,
    Input, Select, MenuItem, InputLabel, TextField, Container,
    ListItemText
} from '@mui/material';

const Modal = ({ onClose = () => { }, editTask }) => {
    var taskschanged = editTask;
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
        //Ref da db
        const docRef = doc(db, 'tasks_db', editTask.id)

        if (taskschanged.status !== status) {

            events += `  Modificou o status de: "${taskschanged.status}" para: "${status}" em  ${dataAtual}. <br></br>`;
            updateDoc(docRef, {
                status,
                events
            })
            onClose(true);
        }
        else if (taskschanged.title !== title) {

            events += `Modificação no título de: "${taskschanged.title}" para: "${title}" em  ${dataAtual}.<br></br>`;
            updateDoc(docRef, {
                title,
                events
            })
            onClose(true);
        }
        else if (taskschanged.description !== description) {

            events += `Modificação na descrição de: "${taskschanged.description}" para: "${description}" em  ${dataAtual}.<br></br>`;
            updateDoc(docRef, {
                description,
                events
            })
            onClose(true);
        }
        if (taskschanged.product !== product) {

            events += `Modificação no produto  de: "${taskschanged.product}" para: "${product}" em  ${dataAtual}.<br></br>`;
            updateDoc(docRef, {
                product,
                events
            })
            onClose(true);
        }
        if (taskschanged.category !== category) {

            events += `Modificação na categoria de "${taskschanged.category}" para: "${category}"  em ${dataAtual}.<br></br>`;
            updateDoc(docRef, {
                category,
                events
            })
            onClose(true);
        }
        if (taskschanged.priority !== priority) {
            events += ` Modificação na prioridade de: "${taskschanged.priority}" para: "${priority}" em ${dataAtual}".<br></br>`;
            updateDoc(docRef, {
                priority,
                events
            })
            onClose(true);
        }
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
                        events += `  Modificou o arquivo para: <a href="${downloadURL}"  target="_blank">ARQUIVO</a> em  ${dataAtual}. <br></br>`;

                        updateDoc(docRef, {
                            fileUrl: downloadURL,
                            events
                        })
                        onClose(true);
                    }))
            }
        )
    }
    return (

        <Grid className="modal" sx={{ mt: 10 }}>
            <Container className="container">
                <Button color="error" sx={{ display: 'flex', right: 'calc(-50% + 34px)' }} onClick={onClose}>
                    <CloseIcon></CloseIcon>
                </Button>
                <form action="#" onSubmit={handleRegister}>
                    <Typography component={'div'} variant="h4">Atualize a tarefa</Typography>
                    <InputLabel>Titulo: </InputLabel>
                    <Input
                        type="text"
                        placheholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                    />
                    <InputLabel>Produto: </InputLabel>
                    <Input
                        type="text"
                        placeholder="Produto"
                        value={product}
                        onChange={(e) => setProduct(e.currentTarget.value)}
                    />
                    <InputLabel>Descrição: </InputLabel>
                    <TextField maxRows={8}
                        sx={{ width: '40vw' }}
                        multiline
                        label="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.currentTarget.value)}
                    />
                    <InputLabel>Categoria: </InputLabel>
                    <Input
                        type="text"
                        placeholder="Categoria"
                        value={category}
                        onChange={(e) => setCategory(e.currentTarget.value)}
                    />
                    <InputLabel>Status:</InputLabel>
                    <Select
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                        sx={{ height: '5vh', minWidth: '10vw' }}
                    >
                        <MenuItem value="Pendente">Pendente</MenuItem>
                        <MenuItem value="Em andamento">Em andamento</MenuItem>
                        <MenuItem value="Finalizada">Finalizada</MenuItem>
                        <MenuItem value="Cancelada">Cancelada</MenuItem>
                    </Select>
                    <InputLabel>Prioridade:</InputLabel>
                    <Select
                        onChange={(e) => setPriority(e.target.value)}
                        value={priority}
                        sx={{ height: '5vh', minWidth: '10vw' }}
                    >
                        <MenuItem value="Média">Média</MenuItem>
                        <MenuItem value="Alta">Alta</MenuItem>
                        <MenuItem value="Baixa">Baixa</MenuItem>
                    </Select>
                    <InputLabel>Arquivo: </InputLabel>
                    <Input
                        sx={{
                            border: '1px solid #ccc',
                            padding: '6px 10px'
                        }}
                        type="file"
                        accept="pdf/txt"
                        onChange={(e) =>
                            setFile(e.currentTarget.files[0])
                        }
                    />
                    <Divider orientation="vertical" flexItem />
                    <Button
                        sx={{ my: 3 }}
                        type="Submit"
                        variant="contained"
                        color="success"
                    >
                        Editar
                    </Button>

                </form>
                <Card elevation={10} sx={{
                    minHeight: '20vh', mt: 3, mx: 2, my: 2, px: 3,
                    backgroundColor: '#FFF5EE'
                }}>
                    <Typography component={'div'}>Historico de alterações de
                        <strong> {editTask.user} </strong>:
                    </Typography>
                    <ListItemText align="left"> {ReactHtmlParser(editTask.events)}</ListItemText>
                </Card>
            </Container>
        </Grid>
    )
}
export default Modal;