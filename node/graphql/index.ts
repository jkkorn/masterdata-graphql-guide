import axios from 'axios'

/**
 * You can learn more about resolvers and its arguments
 * here: https://www.apollographql.com/docs/graphql-tools/resolvers.html
 */
export const resolvers = {
  Query: {
    getClientById: async (_, args, ctx) => {
      console.log(`[get documents by id] with args: ${JSON.stringify(args)} \n and context: ${JSON.stringify(ctx.vtex)}`)
      const http = axios.create({
        headers: {
          'VtexIdclientAutCookie': ctx.vtex.authToken,
        }
      })
      try {
        const { data } = await http.get(`http://${ctx.vtex.account}.myvtex.com/api/dataentities/CL/documents/${args.id}?_fields=firstName,lastName,email`)
        console.log(`[get document by id] MD response data: ${JSON.stringify(data)}`)
        return data
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    searchClientWithAllPossibleFilters: async (_, args, ctx) => {
      const {
        where,
        from = 0,
        to = 10,
      } = args

      const BASE_URL = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/CL/search?_fields=firstName,lastName,email`
      const WHERE_PARAM = where ? `&_where=(${where})` : ''

      const FINAL_URL = BASE_URL + WHERE_PARAM

      console.log(`[searching for specified clients ] with args: ${JSON.stringify(args)} \n and context: ${JSON.stringify(ctx.vtex)}`)
      const http = axios.create({
        headers: {
          'REST-Range': `resources=${from}-${to}`,
          'VtexIdclientAutCookie': ctx.vtex.authToken,
        }
      })
      try {
        const { data } = await http.get(FINAL_URL)
        console.log(`[search for specified clients] MD response data: ${JSON.stringify(data)}`)
        return data
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  }
}
