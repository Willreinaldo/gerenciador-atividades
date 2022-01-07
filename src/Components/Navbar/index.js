import React from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from "../../context/UserAuthContext";
import { Typography, Toolbar, Box, AppBar } from '@mui/material';

const LinksNav = { display: 'flex', textDecoration: 'none', color: '#fff', marginRight: '1em' }

const Navbar = () => {
    const { logOut } = useUserAuth();
    async function handleLogout() {
        try {
            await logOut().then(console.log('logout!'));
        } catch {
            alert("Logout Error!")
        }
    }
    return (
        <Box sx={{
            width: '100%',
            marginBottom: '3rem'
        }}>
            <AppBar>
                <Toolbar sx={{ justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Link to={'/'} style={LinksNav}><Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Solicitações</Typography></Link>
                        <Link to={'/New'} style={LinksNav}><Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Nova Solicitação</Typography></Link>
                        <Link to={'/login'} onClick={() => handleLogout()} style={LinksNav} ><Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Sair</Typography>  </Link>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar
