import React, { useState } from "react";
import {
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from 'firebase/storage';
import {storage,colRef } from '../../utils/firebase'
import { addDoc } from "@firebase/firestore";
import { useUserAuth } from '../../context/UserAuthContext';
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from "../../Components/Navbar";
import "./New.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
    console.log(description);
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

            console.log("File available at", downloadURL);
          });
      }
    );
  }
  if (submitbutton === true) {
    return (<div className="wrapper">
      <CircularProgress></CircularProgress>
    </div>)
  }
  return (
    <>
      <Navbar />
      <Grid>

        <div className="wrapper">
          <h2>Nova solicitação</h2>
          <form action="#" onSubmit={handleRegister}>
            <div className="input-box">
              <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                required />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Produto"
                value={product}
                onChange={(e) => setProduct(e.currentTarget.value)}
                required />
            </div>

            <div>
              Descrição:
              <CKEditor
                editor={ClassicEditor}
                value={description}
                onChange={handleDesc}
              /> 
            </div>
            <div className="input-box">
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
                required
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
        </div>
      </Grid>
    </>
  );
}

export default New;
