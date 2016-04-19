//
//  ViewController1.swift
//  ASPTT
//
//  Created by Sullivan VITIELLO on 12/04/16.
//  Copyright © 2016 Sullivan VITIELLO. All rights reserved.
//

import UIKit

class ViewController1: UIViewController {
    
    @IBOutlet weak var Label: UILabel!
    @IBOutlet weak var open: UIBarButtonItem!
    
    var varView = Int()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        open.target = self.revealViewController()
        open.action = Selector("revealToggle:")
        
        self.view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())
        
        if (varView == 0) {
           Label.text = "Strings"
        }
        else {
            Label.text = "Others"
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
}

