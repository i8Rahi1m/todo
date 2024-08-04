import axios from "axios";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import HideImageIcon from '@mui/icons-material/HideImage';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import './App.css'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TodoList() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let [editname,seteditname] = useState("");
  let [editdesc,seteditdesc] = useState("");
  let [idx,setIdx] = useState(null);
  let [todos, setTodos] = useState([]);

  async function getTodo() {
    try {
      let { data } = await axios.get("http://65.108.148.136:8080/ToDo/get-to-dos");
      setTodos(data?.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function postTodo(formDat) {
    try {
      let { data } = await axios.post("http://65.108.148.136:8080/ToDo/add-to-do", formDat);
      getTodo();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTodo(id) {
    try {
      let { data } = await axios.delete(`http://65.108.148.136:8080/ToDo/delete-to-do?id=${id}`);
      getTodo();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteImg(id) {
    try {
      let { data } = await axios.delete(`http://65.108.148.136:8080/ToDo/delete-to-do-image?imageId=${id}`);
      getTodo();
    } catch (error) {
      console.error(error);
    }
  }

  async function clearTodos() {
    try {
      await Promise.all(todos.map(todo => deleteTodo(todo.id)));
      getTodo();
    } catch (error) {
      console.error(error); 
    }
  }

  async function puttodo(obj){
    try {
      let {data} = await axios.put('http://65.108.148.136:8080/ToDo/update-to-do', obj )
      getTodo()
      handleClose()
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getTodo();
  }, []);

  function changeA(e) {
    e.preventDefault();
    let formDat = new FormData();
    let title = e.target.name.value;
    let desc = e.target.desc.value;
    let images = e.target.images.files;
    formDat.append("Name", title);
    formDat.append("Description", desc);
    for (let i = 0; i < images.length; i++) {
      formDat.append("Images", images[i]);
    }
    postTodo(formDat);
  }
  return (
    <div>
      <div className="block-ad">
        <form style={{width: '75%', padding: '10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-around', margin: 'auto', backgroundColor: 'rgb(56, 133, 248)', alignItems: 'center'}} onSubmit={changeA}>
          <input name="name" type="text" />
          <input name="desc" type="text" />
          <input name="images" multiple type="file" />
      <button onClick={clearTodos}><DeleteForeverIcon/></button>
          <button onClick={() => {}} type="submit">Add</button>
        </form>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', margin: 'auto', width: '94%', marginLeft: '80px'}}>{todos?.map((el) => {
        return (
          <div style={{width: '390px', height: '520px'}} key={el.id}>
            <div style={{display: 'flex', width: '300px', justifyContent: 'space-around'}}><p>{el.name}</p>
            <p>{el.description}</p></div>
            {el?.images?.map((e) => {
              return (
                <div key={e.id}>
                  <img style={{width: '300px', borderRadius: '15px'}} src={"http://65.108.148.136:8080/images/" + e.imageName} alt="todo" />
                  <button style={{position: 'relative', bottom: '-40px', right: '125px'}} onClick={() => deleteImg(e.id)}><HideImageIcon/></button>
                </div>
              );
            })}
            <button style={{marginLeft: '55px'}} onClick={() => deleteTodo(el.id)}><DeleteIcon/></button>
            <button style={{marginLeft: '15px'}} onClick={()=>{handleOpen(),seteditname(el.name),seteditdesc(el.description),setIdx(el.id)}}><EditIcon/></button>
          </div>
        );
      })}</div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input type="text" style={{width:"100%",marginBottom:"20px",height:"30px"}} value={editname} onChange={(e)=>{seteditname(e.target.value)}} placeholder="Name"/><br />
          <input type="text" style={{width:"100%",marginBottom:"20px",height:"30px"}} value={editdesc} onChange={(e)=>{seteditdesc(e.target.value)}} placeholder="Description"/><br />
          <button onClick={()=>{puttodo({name: editname, description: editdesc, id: idx})}} style={{marginRight:"20px"}}>Save</button>
          <button onClick={()=>{handleClose()}}>Cancel</button>
        </Box>
      </Modal>
    </div>
  );
}
//ibra