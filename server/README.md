***STACKOVERFLOW***<br/>
**USOF**<br/>

description:

My task at the moment is to create an API for a future Q&A service for professional programmers and enthusiasts. The latter allows you to share your problems / solutions with short messages and get solutions / feedback or even increase the rating of your profile.

**During the challenge I implemented**:<br/>

- User and Admin access rights
- User Authentication
- User Registration
- User Login, Logout options
- Functionality to reset password and verify user email
- CRUD operations for Posts, Comments, Categories, Likes, Subscribers, Users

**Authentication module**:<br/>
- [x] POST - /api/auth/register - registration of a new user, required parameters are [login, password, password confirmation, email]<br/>
- [x] POST - /api/auth/login - log in user, required parameters are [login, email,password]. Only users with a confirmed email can sign in<br/>
- [x] POST - /api/auth/logout - log out authorized user<br/>
- [x] POST - /api/auth/password-reset - send a reset link to user email, requiredparameter is [email]<br/>
- [x] POST - /api/auth/password-reset/<confirm_token> - confirm new password with a token from email, required parameter is a [new password]<br/>

**User module**:<br/>
- [x] GET - /api/users - get all users<br/>
- [x] GET - /api/users/<user_id> - get specified user data<br/>
- [x] POST - /api/users - create a new user, required parameters are [login, password,password confirmation, email, role]. This feature must be accessible only for admins<br/>
- [x] POST - /api/users/avatar - let an authorized user upload his/her avatar. Theuser will be designated by his/her access token<br/>
- [x]  - /api/users/<user_id> - update user data<br/>
- [x] DELETE - /api/users/<user_id> - delete user<br/>

**Post module**:<br/>
- [x] GET - /api/posts- get all posts.This endpoint doesn't require any role, it ispublic. If there are too many posts, you must implement pagination. Page size isup to you<br/>
- [x] GET - /api/posts/<post_id> - get specified post data.Endpoint is public<br/>
- [x] GET - /api/posts/<post_id>/comments - get all comments for the specified post.Endpoint is public<br/>
- [x] POST - /api/posts/<post_id>/comments - create a new comment, required parameteris [content]<br/>
- [x] GET - /api/posts/<post_id>/categories - get all categories associated with thespecified post<br/>
- [x] GET - /api/posts/<post_id>/like - get all likes under the specified post<br/>
- [x] POST - /api/posts/- create a new post, required parameters are [title, content,categories]<br/>
- [x] POST - /api/posts/<post_id>/like - create a new like under a post<br/>
- [x] PATCH - /api/posts/<post_id> - update the specified post (its title, body orcategory). It's accessible only for the creator of the post<br/>
- [x] DELETE - /api/posts/<post_id> - delete a post<br/>
- [x] DELETE - /api/posts/<post_id>/like - delete a like under a post<br/>
- [x] POST - /api/posts/<post_id>/lock - Lock a post. Available only for admins<br/>
- [x] POST - /api/posts/<post_id>/unlock - Unlock a post. Available only for admins<br/>
- [x] POST - /api/posts/<post_id>/subscribe - Subscribe to post.<br/>
- [x] POST - /api/posts/<post_id>/unsubscribe - Unsubscribe from post.<br/>

**Categories module**:<br/>
- [x] GET - /api/categories- get all categories<br/>
- [x] GET - /api/categories/<category_id> - get specified category data<br/>
- [x] GET - /api/categories/<category_id>/posts - get all posts associated with thespecified category<br/>
- [x] POST - /api/categories - create a new category, required parameter is [title]<br/>
- [x] PATCH - /api/categories/<category_id> - update specified category data<br/>
- [x] DELETE - /api/categories/<category_id> - delete a category<br/>

**Comments module**:<br/>
- [x] GET - /api/comments/<comment_id> - get specified comment data<br/>
- [x] GET - /api/comments/<comment_id>/like - get all likes under the specified comment<br/>
- [x] POST - /api/comments/<comment_id>/like - create a new like under a comment<br/>
- [x] PATCH - /api/comments/<comment_id> - update specified comment data<br/>
- [x] DELETE - /api/comments/<comment_id> - delete a comment<br/>
- [x] DELETE - /api/comments/<comment_id>/like - delete a like under a comment<br/>

**Database tables**:<br/>
- Categories<br/>
- Comments<br/>
- Likes<br/>
- Posts<br/>
- Token<br/>
- Users<br/>



Future plans
- Limit User access to inactive posts so that user can see only their own inactive posts
- Favourites: add functionality to add posts to list of favourites

installation:
```md
> npm install
> mysql -u usof 
> CREATE USER usof IDENTIFIED BY 'nadin1009';
> GRANT ALL PRIVILEGES ON * . * TO usof;

```
usage:
```md
> npm run dev
```

dependencies:<br/>
```md
"axios": "^0.21.1",<br/>
"bcryptjs": "^2.4.3",<br/>
"body-parser": "^1.19.0",<br/>
"crypto": "^1.0.1",<br/>
"dotenv": "^8.2.0",<br/>
"express": "^4.17.1",<br/>
"express-handlebars": "^5.2.0",<br/>
"express-validator": "^6.9.2",<br/>
"handlebars": "^4.7.6",<br/>
"isemail": "^3.2.0",<br/>
"mysql": "^2.18.1",<br/>
"mysql2": "^2.2.5",<br/>
"ngrok": "^3.4.0",<br/>
"nodemailer": "^6.4.17",<br/>
"sequelize": "^6.3.5",<br/>
node v13 and higher<br/>
npm v13 and higher<br/>
```

*Author*:<br/>
**Nadezda Onopriienko** :hatching_chick: 
