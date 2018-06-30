"use strict";
var Company = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.key = obj.key;
        this.companyName = obj.companyName; //公司名字
        this.companySize = obj.companySize; //公司规模
        this.comDes = obj.comDes; //公司描述
        this.comCount = obj.comCount; //投票人数
        this.from = obj.from;
    } else {
        this.key = "";
        this.companyName = "";
        this.companySize = "";
        this.comDes = "";
        this.comCount = 0;
        this.from = "";
    }
};

Company.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

var Department = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.key = obj.key;
        this.cId = obj.cid; //公司id
        this.cName = obj.cname; //公司名字
        this.dName = obj.dName; //部门名字
        this.dDes = obj.dDes; //部门简述
        this.dCount = obj.dCount; //票数
        this.from = obj.from;
    } else {
        this.key = "";
        this.cId = "";
        this.cName = "";
        this.dName = "";
        this.dDes = "";
        this.dCount = 0;
        this.from = "";
    }
};

Department.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};


var CompanyContract = function() {
    //公司的信息
    LocalContractStorage.defineMapProperty(this, "arrayMap");
    LocalContractStorage.defineMapProperty(this, "dataMap");
    LocalContractStorage.defineProperty(this, "size");

    //部门的信息
    LocalContractStorage.defineMapProperty(this, "dArrayMap");
    LocalContractStorage.defineMapProperty(this, "dDataMap");
    LocalContractStorage.defineProperty(this, "dSize");
};

FavouriteCompany.prototype = {
    init: function() {
        this.size = 0;
        this.size1 = 0;
    },
    save: function(key, companyName, companySize, comDes, sj) {
        var index = this.size;
        var from = Blockchain.transaction.from;
        var obj = this.dataMap.get(key);
        if (obj) {
            throw new Error("Company is exist");
        } else {
            obj = new Company();
            obj.key = key;
            obj.companyName = companyName;
            obj.companySize = companySize;
            obj.comDes = comDes;
            obj.count = 0; //参加的总投票人数
            obj.from = from;
            this.size += 1;
            this.arrayMap.put(index, key);
            this.dataMap.put(key, obj);
        }
    },
    get: function(key) {
        return this.dataMap.get(key);
    },
    len: function() {
        return this.size;
    },
    forEach: function(limit, offset) {
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (offset > this.size) {
            throw new Error("offset is not valid");
        }
        var number = offset + limit;
        if (number > this.size) {
            number = this.size;
        }
        var result = '';
        for (var i = offset; i < number; i++) {
            var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
            result += key + '`' + object.companyName + '`' + object.companySize + '`' + object.comDes + '`' + object.count + '`' + object.from + '^';
        }
        return result;
    },
    saveDepartment: function(key, cId, cName, dName, dDes) {
        var index = this.dSize;
        var from = Blockchain.transaction.from;
        var obj = this.dDataMap.get(key);
        if (obj) {
            throw new Error("Department is exeist");
        } else {
            obj = new Department();
            obj.key = key;
            obj.cId = cId;
            obj.cName = cName;
            obj.dName = dName;
            obj.dDesc = dDes;
            obj.count = 0;
            obj.from = from;
            this.dSize += 1;
            this.dArrayMap.put(index, key);
            this.dDataMap.put(key, obj);

            var cObj = this.dataMap.get(cId);
            cObj.count += 1;
            this.dataMap.set(cId, cObj);
        }
    },
    getDepartment: function(key) {
        return this.dDataMap.get(key);
    },
    lenDepartment: function() {
        return this.dSize;
    },
    forEachDepartment: function(limit, offset) {
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (offset > this.dSize) {
            throw new Error("offset is not valid");
        }
        var number = offset + limit;
        if (number > this.dSize) {
            number = this.dSize;
        }
        var result = '';
        for (var i = offset; i < number; i++) {
            var key = this.dArrayMap.get(i);
            var object = this.dDataMap.get(key);
            result += key + '`' + object.cId + '`' + object.cName + '`' + object.dName + '`' + object.dDes + '`' + object.count + '`' + object.from + '^';
        }
        return result;
    },
    vote: function(key) {
        var obj = this.dDataMap.get(key);
        obj.count += 1;
        this.dDataMap.set(key, obj);
    }
};

module.exports = FavouriteCompany;