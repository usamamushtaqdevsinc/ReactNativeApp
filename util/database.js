import * as SQLite from "expo-sqlite";
import { Post } from "../models/Post";

const database = SQLite.openDatabase("posts.db");

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          image TEXT NOT NULL,
          description TEXT NOT NULL,
          owner TEXT NOT NULL,
          likedBy TEXT NOT NULL,
          likeCount INTEGER NOT NULL,
          address TEXT NOT NULL,
          lat REAL NOT NULL,
          lng REAL NOT NULL
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function insertPost(post) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO posts (title, image, description, owner, likedBy, likeCount, address, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.title,
          post.image,
          post.description,
          post.owner,
          post.likedBy,
          post.likeCount,
          post.location,
          post.location.lat,
          post.location.lng,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function fetchPosts() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM posts",
        [],
        (_, result) => {
          const posts = [];

          for (const dp of result.rows._array) {
            posts.push(
              new Post(
                dp.title,
                dp.image,
                dp.description,
                dp.owner,
                dp.likedBy,
                dp.likeCount,
                {
                  address: dp.address,
                  lat: dp.lat,
                  lng: dp.lng,
                },
                dp.id
              )
            );
          }
          resolve(posts);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchPostDetails(id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM posts WHERE id = ?",
        [id],
        (_, result) => {
          const dbPost = result.rows._array[0];
          const post = new Post(
            dbPost.title,
            dbPost.image,
            dbPost.description,
            dbPost.owner,
            dbPost.likedBy,
            dbPost.likeCount,
            {
              address: dbPost.address,
              lat: dbPost.lat,
              lng: dbPost.lng,
            },
            dbPost.id
          );
          resolve(post);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchPostsByOwner(owner) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM posts WHERE owner = ?",
        [owner],
        (_, result) => {
          const posts = [];

          for (const dp of result.rows._array) {
            posts.push(
              new Post(
                dp.title,
                dp.image,
                dp.description,
                dp.owner,
                dp.likedBy,
                dp.likeCount,
                {
                  address: dp.address,
                  lat: dp.lat,
                  lng: dp.lng,
                },
                dp.id
              )
            );
          }
          resolve(posts);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
