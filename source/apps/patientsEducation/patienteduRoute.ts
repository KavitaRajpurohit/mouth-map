import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'

// import auth from '../../common/midlewares/auth';
import patienteduValidation from './patienteduValidation';
import patienteduController from './patienteduController';
import languageUsed from '../../common/middlewares/languageGet';
// Multer for the storage of the profile image
// import multer from 'multer';

const router = express.Router();


// category Route
router.post('/category/', languageUsed, validate(patienteduValidation.createCategory), patienteduController.createCategory);
router.get('/allCategory', auth, languageUsed, validate(patienteduValidation.allCategory), patienteduController.getallCategory);
router.put('/category/updateCategory/', auth, languageUsed, validate(patienteduValidation.updateCategory), patienteduController.updateCategory);
router.delete('/category/:id', languageUsed, patienteduController.deleteCategory);
router.post('/category/updateCategory/', languageUsed, validate(patienteduValidation.updateStatusCategory), patienteduController.updateStatusCategory);
router.get('/allCategoryList', languageUsed, patienteduController.allCategoryList);


// Article Route
router.post('/article/', languageUsed, validate(patienteduValidation.createArticle), patienteduController.createArticle);
router.put('/article/updateArticle/', languageUsed, validate(patienteduValidation.updateArticle), patienteduController.updateArticle);
router.get('/allArticle', languageUsed, validate(patienteduValidation.allArticle), patienteduController.getallArticle);
router.get('/getPatientList', languageUsed, validate(patienteduValidation.getPatientList), patienteduController.getPatientList);

router.delete('/article/:id', languageUsed, patienteduController.deleteArticle);
router.get('/patientDetails/:id', auth, languageUsed, patienteduController.patientDetails);

router.post('/article/updateArticle/', languageUsed, validate(patienteduValidation.updateStatusArticle), patienteduController.updateStatusArticle);

// Patient's Video Route
router.post('/patientVideo/', languageUsed, validate(patienteduValidation.createVideo), patienteduController.createVideo);

router.put('/patientVideo/updatePatientVideo/', languageUsed, validate(patienteduValidation.updateVideo), patienteduController.updateVideo);
router.get('/allVideo', languageUsed, validate(patienteduValidation.allVideo), patienteduController.getallVideo);
router.delete('/patientVideo/:id', languageUsed, patienteduController.deleteVideo);

router.post('/addMyVideo/', auth, languageUsed, validate(patienteduValidation.addMyVideo), patienteduController.addMyVideo);
router.get('/getUserVideo', auth, languageUsed, patienteduController.getMyVideo);
router.delete('/deleteMyVideo/:id', languageUsed, patienteduController.deleteMyVideo);



router.post('/patientVideo/updatePatientVideo/', languageUsed, validate(patienteduValidation.updateStatusVideo), patienteduController.updateStatusVideo);

router.put('/updatePinStatus', languageUsed, patienteduController.updatePinStatus);
router.put('/updateunPinStatus', languageUsed, patienteduController.updateunPinStatus);



export = router