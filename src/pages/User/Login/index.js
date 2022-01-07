import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Avatar, Button, Box, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Logo from '../../../assets/two-tickets.svg'
import { useUserAuth } from "../../../context/UserAuthContext";
import superagent from 'superagent';
export default function Login() {
    
    // Material UI styles
    const paperStyle = { padding: 25, height: '70vh', width: 280, margin: '50px auto', fontFamily: "Roboto" }
    const avatarStyle = { backgroundColor: "blue"}
    const logoStyle = { width: '220px', height: '90px', display: 'block' }
    const inputStyle = { height: '4vh', width: '85%', outline: 'none', padding: '1em', margin: '0.5em' }
    //Firebase authentication 
    const { logIn, signUp } = useUserAuth();
    const [loading, setLoading] = useState(false);
    //const currentUser = useAuth();
    const navigate = useNavigate();
    const { REACT_APP_TAUGOR_APP_USER, REACT_APP_TAUGOR_APP_PASSWORD, REACT_APP_TAUGOR_ROUTE } = process.env;
    const emailRef = useRef();
    const passwordRef = useRef()

    async function handleSignup() {
        setLoading(true)

        try {
            await signUp(emailRef.current.value, passwordRef.current.value);
        }
        catch (error) {
            alert(error.message)
        }
        finally {
            alert("Usuário cadastrado com sucesso!")
        }
        setLoading(false);
    }
    const handleLogin = async () => {
        try {
            setLoading(true)
            await logIn(emailRef.current.value, passwordRef.current.value)
        } catch (error) {
            alert(error.message)
        }
        superagent
            .post(`${REACT_APP_TAUGOR_ROUTE}`)
            .send({ user: `${REACT_APP_TAUGOR_APP_USER}`, password: `${REACT_APP_TAUGOR_APP_PASSWORD}` }) // sends a JSON post body
            .set('accept', 'json')
            .set('Access-Control-Allow-Origin', '*')
            .end(( err, response) => {
                if (response.ok) {
                    navigate("/");
                    setLoading(false);
                }
                else {
                    setLoading(false)
                    navigate("/login");
                    window.alert("Erro de autenticação!",  err)

                }
            });
    }

    return (
        <Grid >
            <Box mt={5}>
            </Box>
            <Paper elevation={11} style={paperStyle}>
                <Grid align='center'>
                    <img src={Logo} alt={"logo"} style={logoStyle} />
                    <Avatar style={avatarStyle}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component={'div'} variant="h6">Faça Login para continuar </Typography>
                </Grid>
                <input ref={emailRef} style={inputStyle} label="email" placeholder="e-mail" />
                <input ref={passwordRef} style={inputStyle} label="password" placeholder="password" type="password" />
                <Box mt={2}>
                    <Button disabled={loading} onClick={handleLogin} type='submit' color="primary" variant="contained" fullWidth>Entrar</Button>
                    <Box mt={1}>
                    </Box>
                    <Button disabled={loading} onClick={handleSignup} type='submit' color="primary" variant="contained" fullWidth>Cadastrar</Button>
                </Box>
            </Paper>
        </Grid>
    );
}
