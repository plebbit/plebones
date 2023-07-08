import { useParams } from 'react-router-dom'
import Post from './post'
// import Modal from 'react-modal'
// Modal.setAppElement('#root')
import Modal from 'react-overlays/Modal'

// const modalStyle = {
//   content: {
//     padding: 0,
//     border: 0,
//     borderRadius: 0,
//     backgroundColor: null,
//     inset: 0
//   },
//   overlay: {
//     backgroundColor: null
//   }
// }

// react-modal is slow 
// const PostModal = () => {
//   const {commentCid} = useParams()
//   const isOpen = !!commentCid

//   return <Modal
//     isOpen={isOpen}
//     closeTimeoutMS={0}
//     style={modalStyle}
//     preventScroll={true}
//   >
//     <div className='app'>
//       <Post/>
//     </div>
//   </Modal>
// }

const modalStyle = {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  top: 0,
  left: 0,
}

const PostModal = () => {
  const {commentCid} = useParams()
  const show = !!commentCid

  return <Modal
    show={show}
    style={modalStyle}
    backdrop={false}
  >
    <div className='app'>
      <Post/>
    </div>
  </Modal>
}

export default PostModal
