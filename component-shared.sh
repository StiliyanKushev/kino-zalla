# make the component folder
mkdir ./src/shared/$1

# add js and css files in it
touch ./src/shared/$1/$1.css
touch ./src/shared/$1/$1.js

# fill the js file with a template
echo "
import './$1.css';

function $1() {
    return (
        <>
            $1
        </>
    );
}

export default $1;" >> ./src/shared/$1/$1.js