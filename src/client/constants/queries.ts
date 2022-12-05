const queries = {
  getPublished: {
    query: {
      bool: {
        must: [{ term: { 'entityState.itemID': 5 } }]
      }
    }
  },

  getPublishedAndDeleted: {
    query: {
      bool: {
        should: [
          { term: { 'entityState.itemID': 7 } },
          { term: { 'entityState.itemID': 5 } }
        ]
      }
    }
  },

  getBySearch(value: string) {
    return {
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: value,
                fields: ['name', 'description'],
                operator: 'and',
                fuzziness: 'auto'
              }
            },
            {
              query_string: {
                query: '*' + value + '*',
                fields: ['name', 'description']
              }
            }
          ]
        }
      }
    };
  }
};

export default queries;
