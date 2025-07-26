'use client'

import * as r from '@/lib/redux';
import { useDispatch, useSelector } from 'react-redux';
import Container from './Container';
import List from './List';
import Search from './search/Search';
import SearchPagination from './search/SearchPagination';
import TenantSelector from './TenantSelector';

export default function Home() {
  const dispatch = useDispatch()
  const tenant = useSelector(state => state.tenant.tenant)

  return (
    <div>
      <nav className='mt-2'>
        <Container>
          <TenantSelector/>
          {tenant &&
            <div className='flex flex-row gap-2 items-start border rounded p-2'>
              <div className='p-2 cursor-pointer' onClick={() => dispatch(r.tenantTenant(undefined))}>
                {tenant.name}
              </div>
              <div className='flex-1'>
                <Search/>
              </div>
            </div>
          }
        </Container>
      </nav>
      {tenant &&
        <main>
          <Container>
            <List/>
            <SearchPagination/>
          </Container>
        </main>
      }
    </div>
  );
}
