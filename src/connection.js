import { WebSocketLink } from "apollo-link-ws";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: new WebSocketLink({
    // uri: "wss://pixel-art-tutorial.herokuapp.com/v1/graphql",
    uri: "wss://pixelart-hasura.herokuapp.com/v1/graphql",
    options: {
      reconnect: true
    }
  })
});
