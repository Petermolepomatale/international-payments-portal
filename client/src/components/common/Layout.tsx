import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  AccountCircle, 
  Logout, 
  Person, 
  Security,
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    // Navigate to profile page if needed
  };

  const getRoleIcon = (role: string) => {
    return role === 'employee' ? <Security fontSize="small" /> : <PaymentIcon fontSize="small" />;
  };

  const getRoleColor = (role: string) => {
    return role === 'employee' ? 'secondary' : 'primary';
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
                transition: 'opacity 0.2s',
              }}
              onClick={() => navigate(user?.role === 'employee' ? '/employee' : '/customer')}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ffffff20 0%, #ffffff10 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                🌍
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    lineHeight: 1.2,
                  }}
                >
                  International Payments Portal
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ 
                    opacity: 0.8,
                    fontSize: '0.75rem',
                  }}
                >
                  Secure • Fast • Reliable
                </Typography>
              </Box>
            </Box>
          </Box>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={getRoleIcon(user.role)}
                  label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  color={getRoleColor(user.role) as any}
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                    color: 'white',
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: 'white',
                    },
                  }}
                />
              </Box>
              
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  {user.fullName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.username}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem 
                  onClick={handleProfile}
                  sx={{ py: 1.5, gap: 1.5 }}
                >
                  <Person fontSize="small" />
                  Profile Settings
                </MenuItem>
                <MenuItem 
                  onClick={() => navigate(user?.role === 'employee' ? '/employee' : '/customer')}
                  sx={{ py: 1.5, gap: 1.5 }}
                >
                  <DashboardIcon fontSize="small" />
                  Dashboard
                </MenuItem>
                <Divider />
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    py: 1.5, 
                    gap: 1.5,
                    color: theme.palette.error.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                    },
                  }}
                >
                  <Logout fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            minHeight: 'calc(100vh - 200px)',
            position: 'relative',
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;