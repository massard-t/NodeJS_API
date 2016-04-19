//
//  ReservationClient.swift
//  ASPTT
//
//  Created by Sullivan VITIELLO on 15/04/16.
//  Copyright © 2016 Sullivan VITIELLO. All rights reserved.
//

import Foundation

class ReservationClient: UIViewController {
    
    @IBOutlet weak var heure: UITextField!
    @IBOutlet weak var date: UITextField!
    @IBOutlet weak var temps: UITextField!
    @IBOutlet weak var coach: UITextField!
    @IBOutlet weak var MenuButton: UIBarButtonItem!
    
    @IBAction func valider(sender: AnyObject) {
        let v_heure = heure.text!
        let v_date = date.text!
        let v_temps = temps.text!
        let v_coach = coach.text!
        let v_client = "1"
        
        let s_heure:NSString = heure.text!
        let s_date:NSString = date.text!
        let s_temps:NSString = temps.text!
        let s_coach:NSString = coach.text!
        let s_client:NSString = ""
        
        let json = "{\"heure\": \"" + v_heure + "\", \"date\": \"" + v_date + "\", \"temps\": \"" + v_temps + "\", \"coach\": \"" + v_coach + "\", \"client\": \"" + v_client + "\"}";
        
        if ( s_heure.isEqualToString("") || s_date.isEqualToString("") || s_temps.isEqualToString("") || s_coach.isEqualToString("") ) {
                let alertView:UIAlertView = UIAlertView()
                alertView.title = "Erreur"
                alertView.message = "Veuillez entrer tous les champs !"
                alertView.delegate = self
                alertView.addButtonWithTitle("OK")
                alertView.show()
        }
        else {
            do {
                let post:NSString = "json=\(json)"
                
                NSLog("PostData: %@",post);
                
                let url:NSURL = NSURL(string:"https://nodeapi-robotbobtm.c9users.io:8081/api/planning")!
                
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
        
        if self.revealViewController() != nil {
            MenuButton.target = self.revealViewController()
            MenuButton.action = "revealToggle:"
            self.view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())
        }
        // Do any additional setup after loading the view, typically from a nib.
    }
    
}