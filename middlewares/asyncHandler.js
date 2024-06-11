
const asyncHandler = fn => (req , res , next) => {
    Promise
    .resolve(fn(req , res , next))
    .catch(next)
}


// in controllers insted of using try&catch block

// const getBootcamp = async (req , res , next) => {
//     try {
//         const {id} = req.params
        
//         const bootcamp = await Bootcamp.findById(id)
        
//         if(!bootcamp){
//             return next(createError(`Resource with this id not found : ${id}` , 404))
//         }

//         res.status(200).json(bootcamp)

//     } catch (error) {
//         next(error)
//     }
// }



// we make the structure like this

// const getBootcamp = asyncHandler(async (req , res , next) => {

//     const {id} = req.params
        
//         const bootcamp = await Bootcamp.findById(id)
        
//         if(!bootcamp){
//             return next(createError(`Resource with this id not found : ${id}` , 404))
//         }

//         res.status(200).json(bootcamp)
// })
