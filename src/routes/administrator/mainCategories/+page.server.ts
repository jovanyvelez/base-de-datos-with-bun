import {allCategories} from '$lib/server/db_queries/query_select';

export const load =  async()=>{
    const categories = await allCategories();
    return {
        categories
    }
}

/*
cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });
*/