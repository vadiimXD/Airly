import requester from "./requester"

async function searchSubmitHandler(e: any, city: string, setWeather: Function, setError: Function) {
    e.preventDefault()

    try {
        const response = await requester(`http://localhost:1337/search`, "POST", true, { city })
        const result = await response.json()
        setWeather(result)
    } catch (error) {
        setError("An error occurred while executing the request!")
    }
    
}


function changeHandler(e: any, setFormValues: any) {

    setFormValues((oldValues: any) => ({
        ...oldValues,
        [e.target.name]: e.target.value,
    }));

};



export {
    searchSubmitHandler,
    changeHandler
}