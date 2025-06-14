import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import DefaultComponents from './components/DefaultComponents/DefaultComponents';
import { isJsonString } from './utils';
import { jwtDecode } from 'jwt-decode';
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/slides/userSlide';
import Loading from './components/LoadingComponent/Loading';
import ChatBot from './components/Message/ChatBot';
import { Modal, Button } from 'antd';

function App() {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false)
  const [openChatBot, setOpenChatBot] = useState(false);
  const user = useSelector((state) => state.user) 

  useEffect(() => {
    setIsPending(true)
    const {storageData, decoded }= handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
    setIsPending(false)
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if(storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date ()
    const {decoded }= handleDecoded()
    if (decoded?.exp < currentTime.getTime() / 1000 ) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}` 
    }
    return config;
    }, (error) => {
      return Promise.reject(error);
    })

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }

  return (
    <div>
      <Loading isPending={isPending}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const isCheckAuth = !route.isPrivate || user?.isAdmin;
              const Layout = route.isShowHeader ? DefaultComponents : Fragment;

              if (!isCheckAuth) return null;

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
          {/* Modal Chatbot */}
          <Modal
            open={openChatBot}
            onCancel={() => setOpenChatBot(false)}
            footer={null}
            width={540}
            bodyStyle={{ padding: 0, borderRadius: 12 }}
            destroyOnClose
          >
            <ChatBot /> 
          </Modal>
          {/* Nút icon Chatbot nổi ở góc dưới bên phải */}
          <Button
            type="primary"
            shape="circle"
            icon={<img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="chatbot" style={{ width: 28, height: 28 }} />}
            size="large"
            style={{
              position: 'fixed',
              right: 32,
              bottom: 32,
              zIndex: 1000,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }}
            onClick={() => setOpenChatBot(true)}
          />
        </Router>
      </Loading>
    </div>
  )
}

export default App