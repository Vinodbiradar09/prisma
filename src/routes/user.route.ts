import { Router } from "express";
import { allBlogsOfUser, allUsers , andORORConditions, basicOperators, connectCategoryToBlog, createBlog, createCategory, createNotifications, createUser, deleteUser, findAllCategory, findCategoryById, getAllUsers, getBlogDetails, getOnlySpecifiedDetails, getUserById, getUserDetails, getUserWhosAgeGTE25, inops, updateIsActive, updateUserDetails } from "../controllers/user.js";

const router : Router = Router();

router.route("/allusers").get(allUsers);

router.route("/createuser").post(createUser);

router.route("/getuserbyid/:id").get(getUserById);

router.route("/updateuserdetails/:id").put(updateUserDetails);

router.route("/isactive/:id").patch(updateIsActive);

router.route("/deleteuser/:id").delete(deleteUser);

router.route("/allactiveusers").get(getAllUsers);

router.route("/getuserdetails/:id").get(getUserDetails);

router.route("/specifieddetails/:id").get(getOnlySpecifiedDetails);

router.route("/age/:minAge/:maxAge").get(getUserWhosAgeGTE25);

router.route("/conditions/:minAge/:maxAge").get(andORORConditions);

router.route("/basicops").get(basicOperators);

router.route("/inops").get(inops);

router.route("/createblog/:userID").post(createBlog);

router.route("/createnotifications/:userId").post(createNotifications);

router.route("/allblogs/:userID").get(allBlogsOfUser);

router.route("/findCategory/:id").get(findCategoryById);

router.route("/allcategory").get(findAllCategory);

router.route("/createcategory").post(createCategory);

router.route("/categories/:id/connect-blog/:blogId").patch(connectCategoryToBlog);

router.route("/blogdetails/:id").get(getBlogDetails);

export {router};
