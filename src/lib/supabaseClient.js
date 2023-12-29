import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SERVER_IMAGES, PUBLIC_SERVER_IMAGES_KEY } from '$env/static/public';

export const grabar =  await createClient(
    PUBLIC_SERVER_IMAGES, PUBLIC_SERVER_IMAGES_KEY
);