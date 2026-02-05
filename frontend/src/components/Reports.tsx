import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'

const Reports: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Reports & Analytics
        </Typography>
        <Button variant="contained" color="primary">
          Generate Report
        </Button>
      </Box>
      <Paper>
        <Box p={3}>
          <Typography variant="h6" color="textSecondary">
            Reports and analytics will be displayed here
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Reports