import React from 'react'
import { Grid, Card, CardContent, Typography, Box } from '@mui/material'
import { LocalGasStation, ShoppingCart, TrendingUp, TrendingDown } from '@mui/icons-material'

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocalGasStation color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h5">15</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ShoppingCart color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h5">1,234</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Revenue Today
                  </Typography>
                  <Typography variant="h5">KES 45,000</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingDown color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Expenses Today
                  </Typography>
                  <Typography variant="h5">KES 12,000</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard