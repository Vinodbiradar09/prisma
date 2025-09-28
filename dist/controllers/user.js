import prisma from "../utils/prisma.js";
import { toUSVString } from "util";
const allUsers = async (req, res, next) => {
    try {
        const userarr = [
            {
                name: "vinod",
                email: "vin",
                age: 20,
            },
            {
                name: "skanda",
                email: "skan",
                age: 20,
            },
            {
                name: "nizzy",
                email: "niz",
                age: 20,
            },
        ];
        const user = userarr.map((u) => {
            return {
                name: u.name,
                email: u.email,
                age: u.age,
            };
        });
        return res.status(200).json({ message: "true", user });
    }
    catch (error) {
        console.error("error while fetching all the user", error);
        return res
            .status(500)
            .json({ error: "error fetching all user", success: false });
    }
};
const createUser = async (req, res, next) => {
    try {
        const { name, email, age, password, interests } = req.body;
        if (!name || !email || !age || !password || !interests) {
            return res.status(400).json({
                message: "All the fields are required",
                success: false,
            });
        }
        const user = await prisma.user.create({
            data: {
                email,
                name,
                age,
                password,
                interests,
                role: "SuperAdmin",
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "failed to create the user",
                success: false,
            });
        }
        return res.status(200).json({
            message: "user created successfully",
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("error in creating the user", error);
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Slug is required",
                success: false,
            });
        }
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                name: true,
                email: true,
                id: true,
                interests: true,
                notificationMethods: {
                    select: {
                        phone: true,
                        user: true,
                    },
                },
                blogs: {
                    select: {
                        title: true,
                        content: true,
                        user: true,
                        userID: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "user not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "user found",
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("error in finding the user");
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
const updateUserDetails = async (req, res, next) => {
    try {
        const { name, age, interests } = req.body;
        const id = req.params.id;
        if (!name || !age || !interests) {
            return res.status(400).json({
                message: "fields are required",
                success: false,
            });
        }
        if (!id) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                name,
                age,
                interests,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "failed to update the details",
                success: false,
            });
        }
        return res.status(200).json({
            message: "user updated successfully",
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("error while updating the user details");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const updateIsActive = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                isActive: true,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "failed to update the user",
                succcess: false,
            });
        }
        return res.status(200).json({
            message: "updated the user activeness",
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("error in updating the Active");
        return res.json({
            message: "Internal server error",
            success: false,
        });
    }
};
// upsert method we can create the user or the update the user
// const createOrUpdateUser = async(req : Request , res : Response , next : NextFunction)=>{
//     try {
//         const {id} = req.params;
//         if(id){
//             console.log("id came");
//             return res.status(400).json({
//                 message : "slug is required",
//                 success : false,
//             })
//         }
//         const {name , age , interests , email , password} = req.body;
//         if(!name || !age || !interests || !email || !password){
//             return res.status(400).json({
//                 message : "details are required",
//                 success : false,
//             })
//         }
//         const user = await prisma.user.upsert({
//             where : {
//                 id : id,
//             },
//             update : {
//                 name,
//                 age,
//                 interests
//             },
//             create : {
//                 name,
//                 age,
//                 interests,
//                 email,
//                 role : "Admin",
//                 password
//             }
//         });
//     } catch (error) {
//         console.error("internal server error")
//         return res.status(500).json({
//             message : "internal server error",
//             success : false
//         })
//     }
// }
const deleteUser = async (req, res, next) => {
    try {
        const { id } = await req.params;
        if (!id) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const deleted = await prisma.user.delete({
            where: {
                id,
            },
        });
        if (!deleted) {
            return res.status(400).json({
                message: "user deleted successfully",
                success: false,
            });
        }
        return res.status(200).json({
            message: "user has deleted successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const all = await prisma.user.findMany({
            where: {
                isActive: true,
            },
        });
        if (!all) {
            return res.json({
                message: "not active users",
                success: false,
            });
        }
        return res.status(200).json({
            message: "all the active users",
            success: true,
            all,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const getUserDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                notificationMethods: {
                    select: {
                        phone: true,
                        email: true,
                    },
                },
                blogs: {
                    select: {
                        title: true,
                        content: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "user not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "user found with details",
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const getOnlySpecifiedDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                name: true,
                email: true,
                age: true,
                isActive: true,
                notificationMethods: {
                    select: {
                        phone: true,
                        email: true,
                    },
                },
                blogs: {
                    select: {
                        title: true,
                        content: true,
                    },
                },
                interests: true,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "user not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "user found",
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const getUserWhosAgeGTE25 = async (req, res, next) => {
    try {
        const { minAge, maxAge } = req.params;
        if (!minAge || !maxAge) {
            return res.status(400).json({
                message: "Age is required",
                success: false,
            });
        }
        const users = await prisma.user.findMany({
            where: {
                age: {
                    gte: parseInt(minAge),
                    lte: parseInt(maxAge),
                },
            },
            select: {
                name: true,
                email: true,
                age: true,
                interests: true,
                notificationMethods: {
                    select: {
                        phone: true,
                        email: true,
                    },
                },
                blogs: {
                    select: {
                        title: true,
                        content: true,
                    },
                },
            },
        });
        if (!users) {
            return res.status(400).json({
                message: "users not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "users found with age > 25",
            success: true,
            users,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
// AND OR conditions
const andORORConditions = async (req, res, next) => {
    // here we will get users who's age is >20 and < 30 or the user's who's are verified
    try {
        const { minAge, maxAge } = req.params;
        if (!minAge || !maxAge) {
            return res.json({
                message: "slugs are required",
                success: false,
            });
        }
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    // basic if we include AND both condition are true the users are found ,// if we use OR either this will apply or that
                    {
                        age: {
                            gte: parseInt(minAge),
                            lte: parseInt(maxAge),
                        },
                    },
                    {
                        isActive: true,
                    },
                ],
            },
            select: {
                name: true,
                email: true,
                age: true,
                isActive: true,
            },
        });
        if (!users) {
            return res.status(400).json({
                message: "users not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Users found",
            success: true,
            users,
        });
    }
    catch (error) {
        console.error("internal server error", error);
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const basicOperators = async (req, res, next) => {
    try {
        // we will use AND and contains
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        email: {
                            contains: "gmail.com",
                        },
                    },
                    {
                        isActive: true,
                    },
                ],
            },
            select: {
                name: true,
                email: true,
                age: true,
                isActive: true,
            },
        });
        if (!users) {
            return res.status(400).json({
                message: "users not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "users found",
            success: true,
            users,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const inops = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        email: {
                            in: [
                                "veeresh@gmail.com",
                                "kirat@gmail.com",
                                "mayya@gmail.com",
                                "hitesh@gmail.com",
                            ],
                        },
                    },
                    {
                        isActive: true,
                        role: "SuperAdmin",
                    },
                ],
            },
        });
        if (!users) {
            return res.status(400).json({
                message: "users not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "users found",
            success: true,
            users,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
// we will create the blogs here only
const createBlog = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                message: "title and content is required",
                success: false,
            });
        }
        if (!userID) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                userID,
                categories: {
                    create: {
                        name: "this is new vinod's category of prisma",
                    },
                },
            },
        });
        if (!blog) {
            return res.status(400).json({
                message: "failed to create blog",
                success: false,
            });
        }
        return res.status(200).json({
            message: "blog created",
            success: true,
            blog,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const createNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const notifications = await prisma.notificationMethods.create({
            data: {
                phone: true,
                email: true,
                userId,
            },
        });
        if (!notifications) {
            return res.status(400).json({
                message: "notification is not created",
                success: false,
            });
        }
        return res.status(200).json({
            message: "notification is created",
            success: true,
            notifications,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const allBlogsOfUser = async (req, res, next) => {
    try {
        const { userID } = req.params;
        if (!userID) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const blogs = await prisma.blog.findMany({
            where: {
                userID,
            },
            select: {
                title: true,
                content: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        age: true,
                        isActive: true,
                    },
                },
            },
        });
        if (!blogs) {
            return res.status(400).json({
                message: "zero blogs of user",
                success: false,
            });
        }
        return res.status(200).json({
            message: "all the blogs of the user",
            success: true,
            blogs,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const findCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
            select: {
                blogs: {
                    select: {
                        title: true,
                        content: true,
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                                age: true,
                                isActive: true,
                                password: true,
                            },
                        },
                    },
                },
            },
        });
        if (!category) {
            return res.status(400).json({
                message: "category not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "category found",
            success: true,
            category,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const findAllCategory = async (req, res, next) => {
    try {
        const allCategory = await prisma.category.findMany({
            include: {
                blogs: {
                    select: {
                        title: true,
                        content: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                                age: true,
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });
        if (!allCategory) {
            return res.status(400).json({
                message: "not found all category",
                success: false,
            });
        }
        return res.status(200).json({
            message: "all the category",
            success: true,
            allCategory,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        // const { id } = req.params;
        // if (!id) {
        //   return res.status(400).json({
        //     message: "slug is required",
        //     success: false,
        //   });
        // }
        if (!name) {
            return res.status(400).json({
                message: "to create the category name is required",
                success: false,
            });
        }
        const category = await prisma.category.create({
            data: {
                name,
            },
        });
        if (!category) {
            return res.status(400).json({
                message: "category name is required",
                success: false,
            });
        }
        return res.status(200).json({
            message: "the category is created",
            success: true,
            category,
        });
        // see to link the category there are three methods
        // first create the category and later update the and link or connect them
        // second create the blog and there only create the category
        // third create the category and there only create the blog
        //    const blog = await prisma.blog.create({
        //         data: {
        //         title: "AI in 2025",
        //         content: "Exciting future...",
        //         user: { connect: { id: "user1" } },
        //         categories: {
        //         connect: [{ id: "cat1" }, { id: "cat2" }], // attach existing categories
        //     },
        // },
        //  include: { categories: true },
        // }); this is the second method
        // const category = await prisma.category.create({
        //   data: {
        //     name: "Science",
        //     blogs: {
        //       create: [
        //         {
        //           title: "Space Exploration 2025",
        //           content: "Some content...",
        //           user: { connect: { id: "user1" } }, // link to an existing user
        //         },
        //       ],
        //     },
        //   },
        //   include: { blogs: true },
        // }); this is third method 
        // we will stick to the first method only 
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const connectCategoryToBlog = async (req, res, next) => {
    try {
        const { id, blogId } = req.params;
        if (!id || !blogId) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const connectedToBlog = await prisma.category.update({
            where: {
                id,
            },
            data: {
                blogs: {
                    connect: {
                        id: blogId,
                    }
                }
            }
        });
        if (!connectedToBlog) {
            return res.json({
                message: "failed to connect to the blog",
                success: false,
            });
        }
        return res.status(200).json({
            message: "successfuly connected",
            success: true,
            connectedToBlog
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false,
        });
    }
};
const getBlogDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "slug is required",
                success: false,
            });
        }
        const blog = await prisma.blog.findUnique({
            where: {
                id,
            },
            select: {
                title: true,
                content: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        age: true,
                        isActive: true,
                    }
                },
                categories: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        if (!blog) {
            return res.status(400).json({
                message: "blog not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "blog found",
            success: true,
            blog,
        });
    }
    catch (error) {
        console.error("internal server error");
        return res.status(500).json({
            message: "internal server error",
            success: false
        });
    }
};
// if we use the include we can select in it , if we use the select then we can't use the include in it
export { allUsers, createUser, getUserById, updateUserDetails, updateIsActive, deleteUser, getAllUsers, getUserDetails, getOnlySpecifiedDetails, getUserWhosAgeGTE25, andORORConditions, basicOperators, inops, createBlog, createNotifications, allBlogsOfUser, findCategoryById, findAllCategory, createCategory, connectCategoryToBlog, getBlogDetails };
//# sourceMappingURL=user.js.map