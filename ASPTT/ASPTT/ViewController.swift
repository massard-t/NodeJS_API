//
//  ViewController.swift
//  ASPTT
//
//  Created by Sullivan VITIELLO on 12/04/16.
//  Copyright © 2016 Sullivan VITIELLO. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    @IBOutlet weak var Email: UITextField!
    @IBOutlet weak var Mdp: UITextField!
    
    func hideKeyboardWhenTappedAround() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: "dismissKeyboard")
        view.addGestureRecognizer(tap)
    }
    
    func dismissKeyboard() {
        view.endEditing(true)
    }

    

   @IBAction func connexion(sender: AnyObject) {
        let mail = Email.text!
        print(mail)
        let mdp = Mdp.text!
        print(mdp)
    
    let json = "{\"email\": \"" + mail + "\", \"mdp\": \"" + mdp + "\"}";
    print(json)
    
    
    
    
    let username:NSString = Email.text!
    let password:NSString = Mdp.text!
    
    if ( username.isEqualToString("") || password.isEqualToString("") ) {
    
        let alertView:UIAlertView = UIAlertView()
        alertView.title = "Erreur"
        alertView.message = "Veuillez entrer votre identifiant et votre mot de passe !"
        alertView.delegate = self
        alertView.addButtonWithTitle("OK")
        alertView.show()
    } else {
    
        do {
            let post:NSString = "json=\(json)"
    
            NSLog("PostData: %@",post);
    
            let url:NSURL = NSURL(string:"https://nodeapi-robotbobtm.c9users.io:8081/api/connect")!
            
            let postData:NSData = post.dataUsingEncoding(NSASCIIStringEncoding)!
    
            let postLength:NSString = String( postData.length )
    
            let request:NSMutableURLRequest = NSMutableURLRequest(URL: url)
            request.HTTPMethod = "POST"
            request.HTTPBody = postData
            request.setValue(postLength as String, forHTTPHeaderField: "Content-Length")
            request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
            request.setValue("application/json", forHTTPHeaderField: "Accept")
        
            var reponseError: NSError?
            var response: NSURLResponse?
    
            var urlData: NSData?
                do {
                    urlData = try NSURLConnection.sendSynchronousRequest(request, returningResponse:&response)
                } catch let error as NSError {
                    reponseError = error
                    urlData = nil
            }
    
            if ( urlData != nil ) {
                let res = response as! NSHTTPURLResponse!;
    
                NSLog("Response code: %ld", res.statusCode);
    
                if (res.statusCode >= 200 && res.statusCode < 300)
                {
                    let responseData:NSString  = NSString(data:urlData!, encoding:NSUTF8StringEncoding)!
    
                    NSLog("Response ==> %@", responseData);
    
    //var error: NSError?
    
                    let jsonData:NSDictionary = try NSJSONSerialization.JSONObjectWithData(urlData!, options:NSJSONReadingOptions.MutableContainers ) as! NSDictionary
                    
                    let success:NSInteger = jsonData.valueForKey("role") as! NSInteger
    
    //[jsonData[@"success"] integerValue];
                    NSLog("Success: %ld", success);
                    if(success == 1)
                    {
                        NSLog("Login SUCCESS");
    
                        let prefs:NSUserDefaults = NSUserDefaults.standardUserDefaults()
                        prefs.setObject(username, forKey: "email")
                        prefs.setInteger(1, forKey: "LOGGEDAS")
                        prefs.synchronize()
                        self.performSegueWithIdentifier("goto_coach", sender: self)
                        
                       // self.dismissViewControllerAnimated(true, completion: nil)
                    }else if(success == 0)
                    {
                        NSLog("Login SUCCESS");
                        
                        let prefs:NSUserDefaults = NSUserDefaults.standardUserDefaults()
                        prefs.setObject(username, forKey: "email")
                        prefs.setInteger(1, forKey: "LOGGEDAS")
                        prefs.synchronize()
                        self.performSegueWithIdentifier("goto_client", sender: self)
                        
                        // self.dismissViewControllerAnimated(true, completion: nil)
                    }
                        
                    else {
                        var error_msg:NSString
    
                        if jsonData["message"] as? NSString != nil {
                            error_msg = jsonData["message"] as! NSString
                        } else {
                            error_msg = "Unknown Error"
                        }
                        let alertView:UIAlertView = UIAlertView()
                        alertView.title = "Sign in Failed!"
                        alertView.message = error_msg as String
                        alertView.delegate = self
                        alertView.addButtonWithTitle("OK")
                        alertView.show()
    
                    }
    
    } else {
                    let alertView:UIAlertView = UIAlertView()
                    alertView.title = "Sign in Failed!"
                    alertView.message = "Connection Failed"
                    alertView.delegate = self
                    alertView.addButtonWithTitle("OK")
                    alertView.show()
                }
    } else {
                let alertView:UIAlertView = UIAlertView()
                alertView.title = "Sign in Failed!"
                alertView.message = "Connection Failure"
                if let error = reponseError {
                    alertView.message = (error.localizedDescription)
                }
                alertView.delegate = self
                alertView.addButtonWithTitle("OK")
                alertView.show()
            }
        } catch {
            let alertView:UIAlertView = UIAlertView()
            alertView.title = "Sign in Failed!"
            alertView.message = "Server Error"
            alertView.delegate = self
            alertView.addButtonWithTitle("OK")
            alertView.show()
        }
    }
}
    
    
    

    override func viewDidLoad() {
        super.viewDidLoad()
        self.hideKeyboardWhenTappedAround()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}

