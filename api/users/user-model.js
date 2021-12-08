const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

async function findPosts(user_id) {
  const rows = await db('users as u')
    .join('posts as p', 'u.id', 'p.user_id')
    .select('username', 'contents', 'p.id as post_id')
    .where('u.id', user_id)
  return rows
  /*
  select
    username,
    contents,
    p.id as post_id
  from users as u
  join posts as p
      on u.id = p.user_id
  where u.id = 2;

    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
}

async function find() {
  const rows = await db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .groupBy('user_id')
    .select('username', 'u.id as user_id')
    .count('p.id as post_count')
  return rows
  /*
    Improve so it resolves this structure:

select
    username,
    u.id as user_id,
    count(p.id) as post_count
from users as u
left join posts as p
    on u.id = p.user_id
group by user_id;

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
}

async function findById(id) {
  const rows = await db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .select('u.id as user_id', 'u.username', 'p.id as post_id', 'contents')
    .where('user_id', id)
  console.log(rows)
  const result = { posts: [] }
  result.user_id = rows[0].user_id

  return result
  /*
    Improve so it resolves this structure:

select
    u.id as user_id,
    u.username,
    p.id as post_id,
    contents
from users as u
left join posts as p
    on u.id = p.user_id
where u.id = 3;

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
