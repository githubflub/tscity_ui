function TSProfilePosts(props) {
   const { profile } = props;

   let result = null

   if (!(profile.posts && profile.posts.length)) {
      result = 'No Posts To Show :('
   }

   return result;
}

export default TSProfilePosts