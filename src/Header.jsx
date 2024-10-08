import { AccountCircle , Menu as MenuIcon} from '@mui/icons-material'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'

const Header = ({handleClose, handleMenu, anchorEl}) => {
  return (
    <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            
          </Typography>
          <div>
            
        
          </div>
          <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={()=>{handleClose('profile')}}>Profile</MenuItem>
                <MenuItem onClick={()=>{handleClose('logout')}}>Logout</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
  )
}

export default Header