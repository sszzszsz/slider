class Test{
    name: any;
    age: any;
    constructor( name, age ) {
        this.name = name;
        this.age = age;
    }

    //ゲッターメソッド
    get myName() {
        return this.name;
    }

}

export = Test;