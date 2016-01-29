/*!
 * xengine
 * Copyright 2012 xiangfeng
 * Released under the MIT license
 * Please contact to xiangfenglf@163.com if you hava any question 
 * xengine ���������������
 */
(function(win){
 /* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
  var initializing = false, 
	  fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor	
    function Class() {
      // All construction is actually done in the init method
      if (!initializing && this.init )
		{		 
		  this.init.apply(this, arguments);		 
	    }        
    }
	//�������ʵ��
	Class.newInstance = function(paramArr)
	{
		initializing = true;
		var obj = new Class();
		initializing = false;
		obj.init.apply(obj,paramArr);		
		return obj;
	}
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee; 
    return Class;
  };
  //�����๤�������е������ͨ��regClass��ʽע�ᵽ�������У�ͨ��newInstance����ʵ��
   win.ClassFactory ={
	   //�����ඨ��
	   classDef:{},
       CLASSIDX:0,
       //ע����
       regClass:function(className,fn)
	   {
		this.classDef[className]={"idx":this.CLASSIDX,"creator":fn};
		this.CLASSIDX++;
	   },
       //�������ʵ��className:ע�������,classArgs��������ʽ���ֵĲ���
	   newInstance:function(className,classArgs)
	   {
		var cs = this.classDef[className];
	    if(cs==null){ throw Error("Class:"+className+" Not Exist!")}
		var obj = cs.creator.newInstance(classArgs);
		return obj;
	   }
   };
}(window))
