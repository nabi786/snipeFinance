import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import CloseIcon from '@mui/icons-material/Close';
export default function Services() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>

    <h2 style={{textAlign : 'center', color :"#339CFD"}}>Title</h2>
    <p style={{textAlign : "center", color : "#339CFD"}}>Text Text</p>
    <List
      sx={{ width: '100%', backgroundColor : "none"}}
      component="nav"
      aria-labelledby="nested-list-subheader"
      // subheader={
      //   <ListSubheader component="div" id="nested-list-subheader" sx={{backgroundColor : "#282e6a", color : "white", textAlign : "center", fontSize : "20px !important"}}>
      //     {/* Services */}
      //   </ListSubheader>
      // }
      >

      <ListItemButton onClick={handleClick} className="listItemsButton">
        {/* <ListItemIcon>
          <InboxIcon sx={{color : "#797C9A"}}/>
        </ListItemIcon> */}
     
            {/* <div style={{display : 'flex', flexDirection : "column"}}>
                    <ListItemText primary="Title" />
                    <ListItemText primary="Text" />
            </div> */}
           
                {open ? <ExpandMore  sx={{marginLeft : "auto"}}/> : <ExpandLess sx={{marginLeft : "auto"}} />}
            
                
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit className="servicesdopdownDownBox">
        <List component="div" disablePadding className="servicesdopdownDownBox2">
          <ListItemButton sx={{ pl: 4 }}  className="collapseService">
            {/* <ListItemIcon>
              <StarBorder sx={{color : "#797C9A"}}/>
            </ListItemIcon> */}

            <div style={{display : 'flex', flexDirection : "column", margin : "auto"}}>
                    <ListItemText primary="Our Services" style={{textAlign : "center", color : "#339CFD"}} />
                    <ListItemText primary="Text text"  style={{textAlign : "center", color : "#339CFD"}}/>
            </div>

          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}  className="collapseService">
            <div className="collapseInnerBox">

              <ListItemIcon>
                <StarBorder sx={{color : "#797C9A"}}/>
              </ListItemIcon>

              <div style={{display : 'flex', flexDirection : "column"}}>
                      <ListItemText primary="Title" />
                      <ListItemText primary="Text" />
              </div>
            </div>

          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}  className="collapseService">
            <div className="collapseInnerBox">

              <ListItemIcon>
                <StarBorder sx={{color : "#797C9A"}}/>
              </ListItemIcon>

              <div style={{display : 'flex', flexDirection : "column"}}>
                      <ListItemText primary="Title" />
                      <ListItemText primary="Text" />
              </div>
            </div>

          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}  className="collapseService">
            <div className="collapseInnerBox">

              <ListItemIcon>
                <StarBorder sx={{color : "#797C9A"}}/>
              </ListItemIcon>

              <div style={{display : 'flex', flexDirection : "column"}}>
                      <ListItemText primary="Title" />
                      <ListItemText primary="Text" />
              </div>
            </div>

          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}  className="collapseService">
            <div className="collapseInnerBox">

              <ListItemIcon>
                <StarBorder sx={{color : "#797C9A"}}/>
              </ListItemIcon>

              <div style={{display : 'flex', flexDirection : "column"}}>
                      <ListItemText primary="Title" />
                      <ListItemText primary="Text" />
              </div>
            </div>

          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}  className="collapseService">
            <div className="collapseInnerBox">

              <ListItemIcon>
                <StarBorder sx={{color : "#797C9A"}}/>
              </ListItemIcon>

              <div style={{display : 'flex', flexDirection : "column"}}>
                      <ListItemText primary="Title" />
                      <ListItemText primary="Text" />
              </div>
            </div>

          </ListItemButton>

          <ListItemButton sx={{ pl: 4, paddingTop : "30px"}}  className="collapseService" onClick={()=>{setOpen(false)}}>
            <ListItemIcon sx={{margin : "auto"}}>
              <CloseIcon sx={{color : "#797C9A"}} />
            </ListItemIcon>

            {/* <div style={{display : 'flex', flexDirection : "column", margin : "auto"}}>
                    <ListItemText primary="Our Services" style={{textAlign : "center", color : "#339CFD"}} />
                    <ListItemText primary="Text text"  style={{textAlign : "center", color : "#339CFD"}}/>
            </div> */}

          </ListItemButton>
        </List>
      </Collapse>
    </List>
      </>
  );
}