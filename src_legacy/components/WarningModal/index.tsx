import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: '#000000',
    color: '#ffffff',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface Props {
    header: string;
    content: string;
    open: boolean;
    setModal: () => void;
    exec: () => void;
}

export default function WarningModal({ header, content, open, setModal, exec }: Props) {
    const handleClose = () => setModal();

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ color: '#ff0000' }}>
                            {header}
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            {content}
                        </Typography>
                        <Button onClick={exec} sx={{ margin: '20px 0 0', width: '100%' }} color="error" variant="contained">Proceed</Button>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}