const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    username: String
    clientId: String
    avatarUri: String
  }

  type EpisodeAnime {
    animeUri: String!
    episodeNumber: Int
  }

  type Anime {
    name: String
    vietnameseName: String
    imageUri: String
    star: Int
    currentEpisode: Int
    views: String
    totalEpisode: Int
    description: String
    genres: [String]
  }

  type AnimeConsumer {
    data: [Anime]! 
  }

  type Comment {
    createdAt: String
    message: String
    username: String
  }

  type FullAnimeDetail {
    name: String
    vietnameseName: String
    imageUri: String
    star: Int
    views: String
    totalEpisode: Int
    animeModel: String
    genres: [String]
    description: String
    episodes: [EpisodeAnime],
    comments: [Comment]
  }

  type Authentication {
    data: String
  }

  type AnimeFollow {
    name: String
    imageUri: String
    vietnameseName: String
  }

  type AllData {
    data: [AnimeFollow]
  }

  type UserInfo {
    firstname: String
    lastname: String
    username: String
    salt: String
    password: String
    email: String
    avatarUri: String
    createdAt: String
  }

  type Query {
    user(username: String, password: String, _csrf: String): User
    listAnime(type: String): AnimeConsumer
    getAnime(animeName: String): FullAnimeDetail
    getAllAnimes(query: String): AnimeConsumer
    getUserByClientId(clientId: String): Authentication
    getUserAnimeFollow(clientId: String): AllData
    getUserDetail(clientId: String): UserInfo
  }
`;

module.exports = typeDefs