import React, { useState } from "react";
import {
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from 'firebase/storage';
import {storage, colRef } from '../../utils/firebase'
import { addDoc } from "@firebase/firestore";
import { useUserAuth } from '../../context/UserAuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from "../../Components/Navbar";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@fontsource/roboto/300.css';
import {Button, Typography, Grid, Paper, Container, Input, Select, MenuItem, InputLabel } from '@mui/material';

function New() {

  var data = new Date(); var dia = data.getDate(); var mes = data.getMonth(); var ano = data.getFullYear();
  var segundos = data.getSeconds(); var minutos = data.getMinutes(); var horas = data.getHours();

  const dataAtual = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  const { user } = useUserAuth();
  const [submitbutton, setSubmitbutton] = useState(false);
  const [priority, setPriority] = useState("Média");
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  
  //config rich text da description
  const handleDesc = (e, editor) => {
    const datadesc = editor.getData()
    setDescription(datadesc)
  }
  async function handleRegister(e) {
    e.preventDefault();
    setSubmitbutton(true);
    // upload do arquivo no Firebase
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
        console.log(`${user.uid}`)
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            //adiciona dados ao firestore
            addDoc(colRef, {
              user: user.email,
              UID: user.uid,
              status: status,
              priority: priority,
              title: title,
              description: description,
              product: product,
              date: dataAtual,
              category: category,
              fileUrl: downloadURL
            }).then
              (setSubmitbutton(false));
            (alert("Atividade cadastrada com sucesso!"));

          });
      }
    );
  }
  if (submitbutton === true) {
    return (
      <Container sx={{ marginTop: '10em' }} align='center'>
      <CircularProgress></CircularProgress>
      </Container>
    )
  }



  return (
  <>
  <Navbar />
     <Grid justify="center" align="center" sx={{mt:11}}>
      <Paper align='center'elevation={10} sx={{ minHeight: '70vh', width:'75vw', p:4 }}>
      <Container>
      <form action="#" onSubmit={handleRegister}>
            <Typography   component={'div'} variant="h5" align="center">Nova solicitação</Typography>
              <Input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                required />
              <Input
                type="text"
                placeholder="Produto"
                value={product}
                onChange={(e) => setProduct(e.currentTarget.value)}
                required />
          <Typography  component={'div'} align="center">Descrição: </Typography>
              <CKEditor
                editor={ClassicEditor}
                value={description}
                onChange={handleDesc}
              /> 
              <Input
                type="text"
                placeholder="Categoria"
                value={category}
                onChange={(e) => setCategory(e.currentTarget.value)}
                required />
          <InputLabel>Status</InputLabel>
              <Select
                onChange={(e) => setStatus(e.target.value)}
                value={status}
                sx={{height:'5vh', minWidth:'10vw'}}
                required>
                <MenuItem value="Pendente">Pendente</MenuItem>
                <MenuItem value="Em andamento">Em andamento</MenuItem>
                <MenuItem value="Finalizada">Finalizada</MenuItem>
                <MenuItem value="Cancelada">Cancelada</MenuItem>
              </Select>
          <InputLabel>Prioridade</InputLabel>
              <Select
                onChange={(e) => setPriority(e.target.value)}
                  sx={{height:'5vh', minWidth:'10vw'}}
                  value={priority}
                required>
                <MenuItem value="Média">Média</MenuItem>
                <MenuItem value="Alta">Alta</MenuItem>
                <MenuItem value="Baixa">Baixa</MenuItem>
              </Select>
              <InputLabel display="none">Arquivo: </InputLabel>
              <Input sx={{  border: '1px solid #ccc', 
              display:'inline-block',
              padding: '6px 10px'}}
                id="docfile"
                type="file"
                accept="pdf/txt"
                onChange={(e) =>
                  setFile(e.currentTarget.files[0])
                }
                required
                 />
                 <br/>
              <Button
              sx={{mt:1}}
              type="Submit"
              variant="outlined" 
               disabled={submitbutton === true} >
                Enviar
                 </Button>
          </form>
          </Container>
          </Paper>
        </Grid>
  </>
  );
}

export default New;
