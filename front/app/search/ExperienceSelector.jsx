'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const ExperienceSelector = ({ setExperience }) => {
  if(!setExperience)
    throw new Error('setExperience')
  return (
    <Select onValueChange={v => setExperience(v)}>
      <SelectTrigger className='w-[200px]'>
        <SelectValue placeholder='Experience'/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='default'>Default</SelectItem>
          <SelectItem value='attributes'>Attributes</SelectItem>
          <SelectItem value='atlassearch'>Search</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default ExperienceSelector