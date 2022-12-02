import { useEffect, useState } from "react";
import useSWR from "swr"
import { doGet } from "../utils/request"

export default function useFetch(url, query, token) {
   

    const fetcher = async (url, query, token)=>{
        const response = await doGet({query, path:url, token})

        if (!response.ok) {
            const error = new Error('An error occurred while fetching the data.')
            // Attach extra info to the error object.
            error.info = await response.json()
            error.status = response.status
            throw error
        }

        return await response.json()
    }

    const {data,error, mutate, isValidating} = useSWR([url, query, token], fetcher);

  
  return {
      data,error,loading:((!data && !error)||isValidating), refresh: mutate
  }
}
