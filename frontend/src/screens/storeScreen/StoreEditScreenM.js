import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { listStoreDetails, updateStore1, createStore } from '../../actions/storeActions'
import { STORE_UPDATE_RESET } from '../../constants/storeConstants'

const StoreEditScreenM = ({ match, history }) => {
  const storeId = match.params.id

  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [cnt, setCnt] = useState('')

  const [location, setLocation] = useState('')
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const storeDetails = useSelector((state) => state.storeDetails)
  const { loading, error, store } = storeDetails

  const storeUpdate = useSelector((state) => state.storeUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = storeUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: STORE_UPDATE_RESET })
      history.push('/manager/mystore')
    } else {
      if (!store.name || store._id !== storeId) {
        dispatch(listStoreDetails(storeId))
      }else {
        setName(store.name)
        setImage(store.image)
        setDescription(store.description)
        setCategory(store.category)
        setCnt(store.cnt)

        setLocation(store.location)
      }
    }
  }
  , [dispatch, history, storeId, store, successUpdate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateStore1({
        _id: storeId,
        name,
        image,
        description,
        category,
        cnt,

        location,
      })
    )
  }

  return (
    <><br/><br/>
      <Link to='/manager/mystore' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Store</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='name'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='image'>
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter image url'
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  ></Form.Control>
                  <Form.File
                    id='image-file'
                    label='Choose File'
                    custom
                    onChange={uploadFileHandler}
                  ></Form.File>
                  {uploading && <Loader />}
                </Form.Group>

                <Form.Group controlId='description'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='category'>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter category'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='cnt'>
                  <Form.Label>Contact No</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter cnt'
                    value={cnt}
                    onChange={(e) => setCnt(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='location'>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter location'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  ></Form.Control>
                </Form.Group>


                <Button type='submit' variant='primary'>
                  Update
            </Button>
              </Form>
            )}<br/><br/><br/><br/>
      </FormContainer>
    </>
  )
}

export default StoreEditScreenM