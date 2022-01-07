import React from 'react';
import Navbar from '../../Components/Navbar';
import {Typography, Box} from '@mui/material';

export default function NotFound() {
    return(
        <div>
            <Navbar/>
                <Box mt={30}>
                <Typography  component={'div'} variant="h2" align="center"> Página não encontrada</Typography>
                </Box>
        </div>
    )
}
