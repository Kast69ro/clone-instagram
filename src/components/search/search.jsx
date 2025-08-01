
'use client'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { useDrawerStore } from '@/store/search/searchStore'
import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useEffect, useState } from 'react'
import { Diversity2Outlined } from '@mui/icons-material'
import Image from 'next/image'
import { API } from '@/utils/config'
import ava from '@/assets/img/pages/profile/profile/ava.jpeg'
import ClearIcon from '@mui/icons-material/Clear'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TemporaryDrawer() {
  const { isOpen, toggleDrawer, searchUser, datas, postSearchHistory, getSearchHistory, history, deleteSearchHistory, clearSearchHistory, loading, closeDrawer } = useDrawerStore()

  const [search, setSearch] = useState('')
  const route = useRouter()
  const theme = localStorage.getItem('theme')


  function handleSearch(e) {
    searchUser(e.target.value)
  }

  function handleClick(id) {
    route.push(`/profile/${id}`)
    postSearchHistory(id)
    closeDrawer()
    setSearch('')
  }

  function byIdFunc(id) {
    route.push(`/profile/${id}`)
    closeDrawer()
  }



  useEffect(() => {
    if (isOpen) {
      getSearchHistory()
    }
  }, [search, isOpen])

  const DrawerList = (
    <Box
      sx={{ width: 420, backgroundColor: theme == 'dark' ? '#121212' : 'white', color: theme == 'dark' ? 'white' : 'black' }}
      role="presentation"
    >
      <div className='px-4'>
        <h1 className='text-[25px] mb-8 mt-5'>Поисковый запрос</h1>

        <div className='rounded-[5px] px-3 bg-[#EFEFEF] flex items-center'>
          <SearchIcon sx={{ color: 'black' }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value), handleSearch(e) }}
            type="search"
            id="customSearchInput"
            placeholder="поиск"
            className="w-[90%] text-[18px] border-none outline-none focus:border-none focus:outline-none px-4 py-2 bg-[#EFEFEF] text-black"
          />
        </div>
      </div>
      <Divider sx={{ margin: '25px 0px' }} />

      <div className='px-4'>
        <div className='flex justify-between'>
          <h2 className='text-[17px] mb-5'>Недавнее</h2>
          <button onClick={clearSearchHistory} className='bg-transparent text-[17px] mb-5 text-[#0095F6] hover:text-black'>Очистить все</button>


        </div>
        <div className='flex flex-col gap-5 ' style={{ backgroundColor: theme == 'dark' ? '#121212' : 'white' }}>

          {
            loading
              ?
              <div className="flex items-center gap-5">
                <Skeleton
                  variant="circular"
                  width={60}
                  height={60}
                  sx={{ bgcolor: 'grey.300' }}
                />
                <div className="flex flex-col gap-2">
                  <Skeleton
                    variant="text"
                    width={120}
                    height={24}
                    sx={{ bgcolor: 'grey.300' }}
                  />
                  <Skeleton
                    variant="text"
                    width={200}
                    height={20}
                    sx={{ bgcolor: 'grey.300' }}
                  />
                </div>
              </div>
              :
              ((search === '' && history.length === 0) ? <p className='text-[#737373] m-auto mt-[200px] mb-[242px]'>Нет недавних запросов.</p> :
                search !== '' ?
                  datas?.map((user) => (
                    <div key={user.id} className='flex items-center gap-5' onClick={() => handleClick(user.id)}>
                      <Image src={user.avatar !== '' ? `${API}/images/${user.avatar}` : ava} alt='avatar' width={70} height={80} className='rounded-[50%] w-[60px] h-[60px]' />
                      <div>
                        <h2>{user.userName}</h2>
                        <h3 className='text-[#9E9E9E]'>{user.fullName} . Подписчики {user.subscribersCount}</h3>
                      </div>

                    </div>

                  )) :
                  history?.map((el) => (
                    <div key={el.id} className='flex items-center justify-between' style={{ marginBottom: theme == 'dark' ? '406px' : '0px' }}>
                      {console.log('GGXXX ', el)}
                      <div className='flex items-center  gap-6' onClick={() => byIdFunc(el.users.id)} >
                        <Image src={el.users.avatar !== '' ? `${API}/images/${el.users.avatar}` : ava} alt='avatar' width={70} height={80} className='rounded-[50%] w-[60px] h-[60px]' />
                        <div>
                          <h2>{el.users.userName}</h2>
                          <h3 className='text-[#9E9E9E]'>{el.users.fullName} . Подписчики {el.users.subscribersCount}</h3>
                        </div>
                      </div>
                      <ClearIcon onClick={() => deleteSearchHistory(el.id)} />
                    </div>
                  )))

          }
        </div>

      </div>



    </Box>
  )

  return (
    <Drawer
      open={isOpen}
      onClose={toggleDrawer}
      anchor="left"
      PaperProps={{
        sx: {
          left: '43px',
          width: '420px',
          top: 0,
          height: '100vh',
          position: 'fixed',
          boxShadow: 3,
        },
      }}
      ModalProps={{
        keepMounted: true,
        BackdropProps: {
          sx: {
            backgroundColor: 'transparent',
          },
        },
      }}
    >
      {DrawerList}
    </Drawer>
  )
}
