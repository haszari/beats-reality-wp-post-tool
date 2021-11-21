
const fs = require( 'fs' );
const yargs = require( 'yargs' );
const axios = require( 'axios' );
const matter = require( 'gray-matter' );
const marked = require( 'marked' );
var Mustache = require( 'mustache' );

require('dotenv').config();

const argv = yargs(process.argv.slice(2))
    .command('post', 'Prep and post a post')
    .option('tracklist', {
        alias: 't',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

if ( ! argv.tracklist ) {
    console.error( 'No tracklist file provided' )
    exit;
}

const file = matter.read( argv.tracklist );
// console.log(file); return;

const tracklistHtml = marked.parse( file.content );
// console.log(tracklistHtml); return;

const template = fs.readFileSync( './templates/beats-reality.mustache', 'utf8' );
// console.log(template); return;
const { 
    mixcloud_url,
    mixcloud_url_r1 
} = file.data;

const postContent = Mustache.render( 
    template,
    {
        mixcloud_url,
        mixcloud_url_r1, 
        tracklistHtml,
    }
);
// console.log(postContent); return;

const url = `${ process.env.WP_BASE_URL }posts`;

console.log( `Using tracklist markdown file ${ argv.tracklist }`);
console.log( `POSTing to ${ url }`);
console.log( `user=${ process.env.WP_USER }, pass=${ process.env.WP_PASSWORD }`);

axios.post( url, {
    status: 'publish',
    content: postContent,
    title: file.data.title,
    // tags need to be passed as IDs for tags that already exist
    // coming sooon
    // tags: file.data.tags,
    }, {
        auth: {
            username: process.env.WP_USER,
            password: process.env.WP_PASSWORD
        },
    } 
).then(function (response) {
    console.log(`Success! Posted as ${ response.data.id }`);
})
.catch(function (error) {
    console.log(error);
});

// console.log(argv);