import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Card,
  CardContent,
  Box,
  Stack,
} from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Framework UI Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.name || user?.email}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutOutlined />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome to Framework UI
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" paragraph>
            This is the main dashboard page. This implementation uses:
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mt: 2 }}>
            <Card sx={{ flex: 1, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Frontend Stack
                </Typography>
                <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                  <li>React with TypeScript</li>
                  <li>Next.js for SSR/SSG</li>
                  <li>Material-UI for design system</li>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  API & State Management
                </Typography>
                <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                  <li>React Query for data fetching</li>
                  <li>GraphQL with graphql-request</li>
                  <li>Optimistic updates & caching</li>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}