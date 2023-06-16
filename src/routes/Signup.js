import { getDbConnection } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export const signUpRoute = {
    path: '/api/signup',
    method: 'post',
    handler: async (req, res) => {
        const { username, email, password } = req.body;
        var responseArray = []
        const db = getDbConnection(process.env.API_DB_NAME);
        const user = await db.collection('usersx').findOne({ "data.attributes.email": email });

        //if user already exist
        if (user) {

            res.status(409).send({
                message: "User Already Exist",
            })
            return;
        }
        //encrypt password
        const passwordHash = await bcrypt.hash(password, 10);
        const JWT_SECRET = "UOsPpf3LCw#oSOhjF07Y%59v2KZAQD"
        const API_LOGIN_PERIOD = "1d"
        //insert
        var result = await db.collection('usersx').insertOne({
            "_id": ObjectId,
            "data": {
                "type": null,
                "attributes": {
                    "password": passwordHash,
                    "gender": null,
                    "title": null,
                    "first_name": "",
                    "last_name": "",
                    "middle_name": null,
                    "email": email,
                    "phone": null,
                    "status": null,
                    "kyc_status": null,
                    "job_title": null,
                    "country_of_residence": null,
                    "nationality": null,
                    "passed_registration_steps": {},
                    "is_vip": false,
                    "date_of_birth": null,
                    "status_title": null,
                    "kyc_status_title": null,
                    "country_of_residence_title": null,
                    "nationality_title": null,
                    "email_verified_at": null,
                    "two_fa_enabled_at": null,
                    "two_fa_driver": null,
                    "isa_enabled_at": null,
                    "created_at": null,
                    "updated_at": null,
                    "impersonated_by": {},
                    "custom_attributes": {
                        "type": null,
                        "properties": {
                            "confirmed_terms_of_services": false,
                            "birth_place": null,
                            "insurance_number": null
                        }
                    },
                    "investor_type": null,
                    "finished_registration_steps": []
                },
                "relationships": {
                    "roles": {
                        "type": null,
                        "id": null
                    },
                    "wallets": {
                        "type": null,
                        "id": null
                    }
                }
            },
            "included": [
                {
                    "type": null,
                    "id": null,
                    "attributes": {
                        "id": null,
                        "name": null,
                        "title": null
                    }
                }
            ]
        })

        const insertedId = result;

        // console.log(insertedId, process.env.JWT_SECRET);

        jwt.sign(
            {
                id: insertedId,
                email,


            },
            JWT_SECRET,
            {
                expiresIn: API_LOGIN_PERIOD
            },
            async (err, token) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                    return token;
                }


                const response = await db.collection('usersx').aggregate([
                    {
                        $project: {
                            "result.data.type.attributes.": 1,

                            _id: insertedId
                        }
                    }
                ])
                console.log(response)


                res.status(200).json({ result,data:response});

            })




    }
}