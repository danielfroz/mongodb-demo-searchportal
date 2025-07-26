'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import * as r from "@/lib/redux"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const SearchPagination = () => {
  const dispatch = useDispatch()
  const tenant = useSelector(state => state.tenant.tenant)
  const filter = useSelector(state => state.patient.search?.filter)
  const pagination = useSelector(state => state.patient.search?.pagination) || { pos: 0, max: 50 }
  const result = useSelector(state => state.patient.search?.result)
  const [ pages, setPages ] = useState([])
  const [ pagesCurrent, setPagesCurrent ] = useState(0)
  const [ pagesTotal, setPagesTotal ] = useState(0)

  useEffect(() => {
    // everytime tenant or filters changes,
    // then pagination is reset
    dispatch(r.patientSearchPagination({ pos: 0, max: 50 }))
  }, [ filter, tenant ])

  useEffect(() => {
    // 
    // computes pages...
    // 
    if(!result || !result.total) {
      setPages([])
      return
    }

    // console.log('computing...')
    // pagination shall be the created considering
    const current = Math.ceil(pagination.pos / pagination.max)
    const pagesTotal = Math.floor(result.total / pagination.max)
    const pages = new Array()
    let initial = 0
    if(pagesTotal > 10 && current > 5) {
      initial = current - 5
    }
    for(let i=initial; i < pagesTotal && pages.length < 10; i++) {
      pages.push(i)
    }
    setPages(pages)
    setPagesCurrent(current)
    setPagesTotal(pagesTotal)
  }, [ result, pagination ])

  function first() {
    dispatch(r.patientSearchPagination({
      pos: 0,
      max: pagination.max,
    }))
    // triggering search()
    dispatch(r.patientSearchReload(Date.now()))
  }

  function last() {
    if(!pagesTotal) {
      return
    }
    dispatch(r.patientSearchPagination({
      pos: (pagesTotal - 1) * pagination.max,
      max: pagination.max
    }))
    // triggering search()
    dispatch(r.patientSearchReload(Date.now()))
  }

  function next() {
    // user is on last page...
    if((pagesCurrent+1) >= pagesTotal) {
      return
    }
    dispatch(r.patientSearchPagination({
      pos: (pagesCurrent + 1) * pagination.max,
      max: pagination.max,
    }))
    // triggering search()
    dispatch(r.patientSearchReload(Date.now()))
  }

  function prev() {
    if(pagesCurrent <= 1) {
      dispatch(r.patientSearchPagination({
        pos: 0,
        max: pagination.max,
      }))
    }
    else {
      dispatch(r.patientSearchPagination({
        pos: (pagesCurrent - 1) * pagination.max,
        max: pagination.max
      }))
    }
    // triggering search()
    dispatch(r.patientSearchReload(Date.now()))
  }

  function jump(page) {
    dispatch(r.patientSearchPagination({
      pos: page * pagination.max,
      max: pagination.max,
    }))
    // triggering search()
    dispatch(r.patientSearchReload(Date.now()))
  }

  if(!pages || pages.length == 0) {
    return null
  }

  return (
    <Pagination className='my-2'>
      <PaginationContent>
        {/* <PaginationItem className='cursor-pointer'>
          <PaginationLink className='gap-1 px-2.5 sm:pl-2.5' onClick={() => first()}>
            <ArrowLeftFromLine/>
            <span className='sm:block'>
              First
            </span>
          </PaginationLink>
        </PaginationItem> */}
        <PaginationItem className='cursor-pointer' onClick={() => prev()}>
          <PaginationPrevious/>
        </PaginationItem>
        {pages && pages.map((page, idx) =>
          <PaginationItem key={idx} className='cursor-pointer' onClick={() => jump(page)}>
            <PaginationLink isActive={page === pagesCurrent}>
              {page + 1} 
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem className='cursor-pointer' onClick={() => next()}>
          <PaginationNext/>
        </PaginationItem>
        {/* <PaginationItem className='cursor-pointer' onClick={() => last()}>
          <PaginationLink>
            <span className='sm:block'>
              Last
            </span>
            <ArrowRightFromLine/>
          </PaginationLink>
        </PaginationItem> */}
      </PaginationContent>
    </Pagination>
  )
}

export default SearchPagination