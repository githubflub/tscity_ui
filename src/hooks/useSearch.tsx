import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useLazyQuery, useApolloClient } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import BootstrapInput from 'components/BootstrapInput/BootstrapInput'
import { updateSearch, SearchKeys } from 'redux_store/modules/search/search'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'

interface UseSearchHookArgs {
   query: any;
   search_key: keyof typeof SearchKeys;
   query_result_key: string;
   onFeelingLucky?: (search_term: string) => any;
   show_submit_button?: boolean;
   placeholder?: string;

   // User performs a search. Gets results.
   // If they clear the search input (with backspace or
   // whatever), do you want to hide the results?
   // If they start typing something else, before they press
   // enter again, do you want to filter the current results
   // according to what they've typed?
   // If so, set dynamic = true.
   //
   // dynamic is a function that takes an item from the search
   // results and returns a string to compare
   // to search_input.value
   dynamic?: (item: any, index: number, array: any[]) => string;
}

export function useSearch(args: UseSearchHookArgs) {
   const {
      search_key,
      query,
      query_result_key,
      onFeelingLucky,
      show_submit_button,
      placeholder = '',
      dynamic = false,
   } = args;
   const { [search_key]: stored_search } = useSelector(state => state.search);
   const [search_input, setSearchInput] = useState({ value: stored_search })
   const [search_results, setSearchResults] = useState([])
   const history = useHistory();
   const dispatch = useDispatch();
   const apollo_client = useApolloClient();
   const { blocklist } = useGetSelfQuery()

   const [search, search_result] = useLazyQuery(query, {
      onCompleted: data => setSearchResults(data[query_result_key] || []),
   })

   const sendSearch = async (search_term: string, cache_only: boolean = false) => {
      const options = {
         variables: {
            search_term: search_term
         }
      }

      // If the user clicks back, I don't
      // want to run searches. I just want to
      // retrieve past searches. Hence, only
      // check cache.
      if (cache_only) {
         const result = await apollo_client.query({
            ...options,
            fetchPolicy: 'cache-only',
            query: query,
         })

         if (result && result.data && result.data[query_result_key]) {
            setSearchResults(result.data[query_result_key]);
         }
      }
      else {
         search(options);
      }
   }


   // Update redux store when component unmounts.
   useEffect(
      () => {
         if (history.action === 'PUSH') {
            // When a user clicks back, I
            // want to show previous search.
            // If they're navigating normally,
            // indicated by action === 'PUSH',
            // don't show previous search results.
            setSearchInput({ value: '' })
            dispatch(updateSearch({ key: search_key, search: '' }))
         }
         else if (stored_search.trim()) {
            sendSearch(stored_search.trim(), true);
         }

         return () => {
            setSearchInput(current_search => {
               dispatch(updateSearch({ key: search_key, search: current_search.value }))
               return current_search;
            })
         }
      },
      []
   )

   const onFeelingLuckyClick = () => {
      const search_term = search_input.value.trim();

      if (!search_term) return;

      onFeelingLucky(search_term);
   }

   const onFormSubmit = event => {
      event.preventDefault();

      const search_term = search_input.value.trim();

      if (!search_term) return;

      sendSearch(search_term);
   }

   let filtered_search_results = search_results;

   // Filter blocked users...
   if (query_result_key === 'searchUsers') {
      filtered_search_results = filtered_search_results
         .filter(item => !blocklist.includes(item.id))
   }

   filtered_search_results = !dynamic
      ? filtered_search_results
      : !search_input.value.trim()
         ? []
         : filtered_search_results
            .filter((item, i, users) => {
               if (dynamic(item, i, users).toLowerCase().includes(search_input.value.toLowerCase())) {
                  return true;
               }

               return false;
            })


   return {
      search_results: filtered_search_results,
      search_result,
      search_input,
      SearchForm: (
         <form autoComplete="off" onSubmit={onFormSubmit}>
            <BootstrapInput
               placeholder={placeholder}
               value={search_input.value || ''}
               onChange={event => setSearchInput({ value: event.target.value })}
            />
            {onFeelingLucky && <Button
               variant="contained"
               color="primary"
               disabled={search_result.loading}
               onClick={onFeelingLuckyClick}
            >
               {`I'm feeling lucky`}
            </Button>}
            {show_submit_button && <Button
               variant="contained"
               color="primary"
               type="submit"
               disabled={search_result.loading}
            >
               {`Search`}
            </Button>}
         </form>
      ),

   }
}