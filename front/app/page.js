'use client'

import * as r from '@/lib/redux';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from './Container';
import List from './List';
import Search from './search/Search';
import SearchPagination from './search/SearchPagination';
import TenantSelector from './TenantSelector';

export default function Home() {
  const dispatch = useDispatch()
  const tenant = useSelector(state => state.tenant.tenant)

  function deselect() {
    dispatch(r.tenantTenant(undefined))
  }

  return (
    <div>
      <nav className='mt-2'>
        <Container>
          <TenantSelector/>
          {tenant &&
            <Fragment>
              <div className='border rounded cursor-pointer p-2' onClick={deselect}>
                {tenant.name}
              </div>
            <div className='flex flex-row gap-2 items-start border rounded p-2'>
              <div className='flex-1'>
                <Search/>
              </div>
            </div>
            </Fragment>
          }
        </Container>
      </nav>
      {tenant &&
        <main className='mb-2'>
          <Container>
            <List/>
            <SearchPagination/>
          </Container>
        </main>
      }
    </div>
  );
}
