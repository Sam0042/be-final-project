import { Op, col, or, Sequelize } from "sequelize";
import Patient from "../models/Patient.js";
import { response } from "express";

class Responsing{
    message;
    statusCode;
    message;

    filteringTarget;
    filteringValue;
    filter;

    sortColumn;
    sortOrder;

    //FUNCTION SCOPE
    setQuery(query){
        this.query = query;
    }
    setMessage(message){
        this.message = message;
    }
    setStatusCode(statusCode){
        this.statusCode = statusCode;
    }

    //SORT FUNCTION
    setSortColumn($sortColumn){
        this.sortColumn = $sortColumn;
    }
    setSortOrder($sortOrder){
        this.sortOrder = $sortOrder;
    }
    //FILTERING FUNCTION
    setFilter(filter){
        this.filter = filter
    }
    setFilteringTarget($filteringTarget){
        this.filteringTarget = $filteringTarget;
    }
    setFilteringValue($filteringValue){
        this.filteringValue = $filteringValue;
    }
    //FUNCTION UNTUK MENAMPILKAN HANYA PESAN
    getMsgOnly(res){
        const data = {
            message: `${this.message}`,
        };
        return res.status(this.statusCode).json(data)
    }
    //FUNCTION UNTUK MENAMPILKAN PESAN DAN DATA
    getMsgAndData(res){
        const data = {
            message: `${this.message}`,
            data: this.query
        };
        return res.status(this.statusCode).json(data)
    }

    isTrue = async(columnName) => {
        try {
            const columns = await Patient.describe();
            return columns.hasOwnProperty(columnName);
          } catch (error) {
            console.error('Error checking column:', error);
            return false;
          }
    }

    async filtering(res){
        const filteringValue = this.filteringValue;
        const filteringTarget = this.filteringTarget;
        
        if(filteringTarget == "name"){
            const filteringTargetDinamis = {
                name :{
                    [Op.substring]: filteringValue
                }
            };
            const filtering = await Patient.findAll({
                where:filteringTargetDinamis
            })
            this.setFilter(filtering)
        }
        else if(filteringTarget == "address"){
            const filteringTargetDinamis = {
                address :{
                    [Op.substring]: filteringValue
                }
            };
            const filtering = await Patient.findAll({
                where:filteringTargetDinamis
            })
            this.setFilter(filtering)
        }
        
        if(filteringValue){
                if(this.filter && this.filter != ""){
                    const data = {
                        message: `Filtering patients by ${filteringTarget}`,
                        data: this.filter
                    }
                    // return response()->json($data,$this->statusCode); 
                    return res.status(this.statusCode).json(data)
                }
                else{
                    const data = {
                        message: `${filteringTarget} not found`
                    }
                    return res.status(404).json(data)
                }
            }
        else{
            $getFilteringTargetValueEmptyError = new Responsing();
            $getFilteringTargetValueEmptyError.setMessage("Please fill the filtering value");
            $getFilteringTargetValueEmptyError.setStatusCode(404);
            return $getFilteringTargetValueEmptyError.getMsgOnly();
        }
        
    }


}

class PatientsController{
    //INDEX
    async index(req,res){
        const {order,sort,name,address,status} = req.query;

        //SORTING
        if("sort" in req.query){
            const sortOrder = order;
            const sortColumn = sort;

            //validasi jika sort true dan order false
            if(sortColumn && !sortOrder){
                const getOrderEmptyError = new Responsing();
                getOrderEmptyError.setMessage("Please fill the order value");
                getOrderEmptyError.setStatusCode(404);
                return getOrderEmptyError.getMsgOnly(res);
            }

            //validasi jika sort false dan order true
            else if(!sortColumn && sortOrder){
                const getSortEmptyError = new Responsing();
                getSortEmptyError.setMessage("Please fill the sort value");
                getSortEmptyError.setStatusCode(404);
                return getSortEmptyError.getMsgOnly(res);
            }
            else{
                const isValueValid = new Responsing()
                isValueValid.setSortColumn(sortColumn)
                isValueValid.setSortOrder(sortOrder)
                const aa = isValueValid.isTrue(sortColumn)
                const a = aa.then((result) => {
                    if(result){
                        if(sortOrder == "asc" || sortOrder == "desc"){
                            return true
                        }
                        else{
                            return false;
                        }
                    }
                    else{
                        return false
                    }
                })
                const b = await a
                

                if(b){
                    const sorting = await Patient.findAll({
                        order: [
                            [sort, order]
                        ]
                    })
                    const data = {
                        message:`Sorting patients by ${sort} with ${order}ending order`,
                        data: sorting,
                    };
                    res.status(200).json(data)
                }
                else{
                    if(sortOrder == "asc" || sortOrder == "desc"){
                        if(sortColumn == "tanggal_masuk"){
                            const sorting = await Patient.findAll({
                                order: [
                                    ["in_date_at", order]
                                ]
                            })
                            const getSortByTanggalMasukMessage = new Responsing()
                            getSortByTanggalMasukMessage.setQuery(sorting)
                            getSortByTanggalMasukMessage.setMessage(`Sorting patients by tanggal_masuk with ${order}ending order`)
                            getSortByTanggalMasukMessage.setStatusCode(200)
                            return getSortByTanggalMasukMessage.getMsgAndData(res)
                        }
                        else if(sortColumn == "tanggal_keluar"){
                            const sorting = await Patient.findAll({
                                order: [
                                    ["out_date_at", order]
                                ]
                            })
                            const getSortByTanggalKeluarMessage = new Responsing()
                            getSortByTanggalKeluarMessage.setQuery(sorting)
                            getSortByTanggalKeluarMessage.setMessage(`Sorting patients by tanggal_keluar with ${order}ending order`)
                            getSortByTanggalKeluarMessage.setStatusCode(200)
                            return getSortByTanggalKeluarMessage.getMsgAndData(res)

                        }
                        else{
                            const getSortValueError = new Responsing()
                            getSortValueError.setMessage("Sort value not found")
                            getSortValueError.setStatusCode(404)
                            return getSortValueError.getMsgOnly(res)
                        }
                    }
                    else{
                        const getOrderValueError = new Responsing()
                        getOrderValueError.setMessage("Order value must be asc or desc")
                        getOrderValueError.setStatusCode(404)
                        return getOrderValueError.getMsgOnly(res)
                    }
                }
            }
        }

        //FILTERING BY NAME
        else if("name" in req.query){
            const filter = await Patient.findAll({
                where:{
                    name: {
                        [Op.substring]: name
                    }
                }
            })
            const getFilterByName = new Responsing()
            getFilterByName.setFilteringTarget("name")
            getFilterByName.setFilteringValue(name)
            getFilterByName.setStatusCode(200)
            return getFilterByName.filtering(res)

        }

        //FILTERING BY STATUS
        else if("status" in req.query){
            if(status == "positif" || status == "sembuh" || status == "meninggal"){
                const filter = await Patient.findAll({
                    where:{
                        status: {
                            [Op.substring]: status
                        }
                    }
                })
                const getFilteringByStatusMessage = new Responsing()
                getFilteringByStatusMessage.setQuery(filter)
                getFilteringByStatusMessage.setMessage("Filtering patients by status")
                getFilteringByStatusMessage.setStatusCode(200)
                return getFilteringByStatusMessage.getMsgAndData(res)
            }
            else{
                const getInvalidStatusValueMessage = new Responsing()
                getInvalidStatusValueMessage.setMessage("Status value must be positif, sembuh, or meninggal")
                getInvalidStatusValueMessage.setStatusCode(404)
                return getInvalidStatusValueMessage.getMsgOnly(res)
            }
        }

        //FILTERING BY ADDRESS
        else if("address" in req.query){
            if(req.query.address != ""){
                const filter = await Patient.findAll({
                    where:{
                        address: {
                            [Op.substring]: address
                        }
                    }
                })
                const getFilterByName = new Responsing()
                getFilterByName.setFilteringTarget("address")
                getFilterByName.setFilteringValue(address)
                getFilterByName.setStatusCode(200)
                return getFilterByName.filtering(res)
            }
        }

        else{
            const patients = await Patient.findAll(
                {limit:5}
            ); //GET RESOURCE DENGAN PAGINATION 

            if(patients){
                const getAllPatientsMessage = new Responsing()
                getAllPatientsMessage.setQuery(patients)
                getAllPatientsMessage.setMessage("Sorting patients")
                getAllPatientsMessage.setStatusCode(200)
                return getAllPatientsMessage.getMsgAndData(res)
            }
            else{
                const getDataNotAvailableMessage = new Responsing()
                getDataNotAvailableMessage.setMessage("Data not available")
                getDataNotAvailableMessage.setStatusCode(404)
                return getDataNotAvailableMessage.getMsgOnly(res)
            }
        }
    }

    async store(req,res){
        const patient = await Patient.create(req.body);

        const getStoredPatientMessage = new Responsing()
        getStoredPatientMessage.setQuery(patient)
        getStoredPatientMessage.setMessage("Patient is created successfully")
        getStoredPatientMessage.setStatusCode(201)
        return getStoredPatientMessage.getMsgAndData(res)
    }

    async update(req,res){
        const {status} = req.body;
        const {id} = req.params;

            const patient = await Patient.findByPk(id);

            if(patient){
                const condition = {
                    where:{
                        id:id,
                    }
                }

                await Patient.update(req.body,condition);
                
                const patient = await Patient.findOne(condition);

                const getUpdatedPatientMessage = new Responsing()
                getUpdatedPatientMessage.setQuery(patient)
                getUpdatedPatientMessage.setMessage(`Patient data has been updated`)
                getUpdatedPatientMessage.setStatusCode(200)
                return getUpdatedPatientMessage.getMsgAndData(res)
            }
            else{
                const someError = new Responsing();
                someError.setMessage("Patient not found");
                someError.setStatusCode(404);
                return someError.getMsgOnly(res)
            }
    }

    async destroy(req,res){
        const {id} = req.params;
        const patient = await Patient.findByPk(id);

        if(patient){
            const condition = {
                where: {
                    id: id,
                }
            };
            await Patient.destroy(condition);

            const getDeletedPatientDestroyMessage = new Responsing();
            getDeletedPatientDestroyMessage.setMessage(`Patient data has been deleted`);
            getDeletedPatientDestroyMessage.setStatusCode(200);
            return getDeletedPatientDestroyMessage.getMsgOnly(res);
        }
        else{
            const someError = new Responsing();
            someError.setMessage("Patient not found");
            someError.setStatusCode(404);
            return someError.getMsgOnly(res)
        }
    }

    async show(req,res){
        const {id} = req.params;
        const patients = await Patient.findByPk(id);

        if(patients){
            const condition = {
                where: {
                    id: id,
                }
            }
            const patient = await Patient.findOne(condition);

            const getDetailPatient = new Responsing();
            getDetailPatient.setQuery(patient);
            getDetailPatient.setMessage(`Get spesific data of patient with id: ${id}`);
            getDetailPatient.setStatusCode(200);
            return getDetailPatient.getMsgAndData(res);
        }
        else{
            const someError = new Responsing();
            someError.setMessage("Patient not found");
            someError.setStatusCode(404);
            return someError.getMsgOnly(res)
        }
    }
}

const object = new PatientsController();

export default object;