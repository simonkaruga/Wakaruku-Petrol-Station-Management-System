import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'

const Products: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Products Management
        </Typography>
        <Button variant="contained" color="primary">
          Add Product
        </Button>
      </Box>
      <Paper>
        <Box p={3}>
          <Typography variant="h6" color="textSecondary">
            Products list will be displayed here
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Products