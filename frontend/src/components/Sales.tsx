import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'

const Sales: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Sales Management
        </Typography>
        <Button variant="contained" color="primary">
          Record Sale
        </Button>
      </Box>
      <Paper>
        <Box p={3}>
          <Typography variant="h6" color="textSecondary">
            Sales records will be displayed here
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Sales