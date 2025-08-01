'use client';
import React, { useState } from 'react';
import { Button, Container } from '@mui/material';
import CreatePostModal from '../../components/createPost/createpost';

export default function CreatePage() {
  const [open, setOpen] = useState(false);

  return (
    <Container sx={{ mt: 5 }}>
      <Button variant="contained" onClick={() => setOpen(true)}>
 create
      </Button>

      <CreatePostModal open={open} onClose={() => setOpen(false)} />
    </Container>
  );
}
